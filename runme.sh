#!/bin/bash -e
# Syntax runme.sh [-d|--dryrun] [-h|--help]

DRY_RUN=0
STEP_COUNTER=1
IS_DEMO=0
NEW_APP_NAME=
DEFAULT_APP_NAME=
RANDOM_BRANCH=
SKIP_PROMPT=0

SED_BIN=

help() {
    echo """
    > runme.sh [-d|--dryrun] [-h|--help] [-n|--notdemo] [-p|--skipprompt]
    """
}

user_confirmation() {
  read -p "$1" USER_CONFIRMATION

  if [ -z $USER_CONFIRMATION ] || [ $USER_CONFIRMATION = "n" ] || [ $USER_CONFIRMATION = "no" ]
  then
    echo "Aborting..."
    exit 1
  elif [ $USER_CONFIRMATION = "y" ] || [ $USER_CONFIRMATION = "yes" ]
  then
      echo "Proceeding..."
      return 0
  else
      echo "Aborting..."
      exit 2
  fi
}

check_command_exists() {
  CMD=$1
  BREW_PKG=$2
  VERSION_CMD=$3

  if ! $CMD $VERSION_CMD &> /dev/null
  then
    echo "!!! $CMD command not found"
    if [ "$SKIP_PROMPT" = 0 ]
    then
      user_confirmation "Would you like to install it (y/N): "
    fi
    brew install $BREW_PKG
  else
      echo "✅ $CMD already installed"
  fi
}

verify_prerequisites() {
  OS_FLAVOR=`uname`
  if [ $OS_FLAVOR = "Darwin" ]
  then
    check_command_exists gsed gnu-sed --version
    SED_BIN=gsed
  else
    SED_BIN=sed
  fi
}

emptycheck() {
  if [ -z "$2" ]
  then
    echo
    echo "!!! Error: $1 cannot be empty."
    return "-1"
  else
    return 0
  fi
}

step() {
  echo
  echo "⭐ Step $STEP_COUNTER: $1"
  echo
  STEP_COUNTER=$((STEP_COUNTER+1))
}

read_user_input() {
  return $
}

# detect origin git url and appname
GIT_URL=$(git config --get remote.origin.url)
if [[ $GIT_URL =~ ^git.* ]]
then
tmp=${GIT_URL#"git@"}
tmp=${tmp/:/\/}
GIT_URL="https://${tmp}"
fi
tmp=${GIT_URL##*\/}
tmp=${tmp%".git"}
DEFAULT_APP_NAME=${tmp%"-deployment"}

get_user_input() {
  step "User Input"
  if [ "$SKIP_PROMPT" = 0 ]
  then
    read -p "☞ Enter new micro-service name [$DEFAULT_APP_NAME]: " NEW_APP_NAME
  fi
  NEW_APP_NAME=${NEW_APP_NAME:-$DEFAULT_APP_NAME}
  emptycheck "New micro-service Name" $NEW_APP_NAME
}

while [[ $# -gt 0 ]]
do
  key="${1}"

  case ${key} in
  -a|--app-name)
    NEW_APP_NAME="$2"
    shift
    shift
    ;;
  -d|--dryrun)
    DRY_RUN=1
    shift
    ;;
  -D|--demo)
    IS_DEMO=1
    shift
    ;;
  -h|--help)
    help
    exit 0
    ;;
  -p|--skipprompt)
    SKIP_PROMPT=1
    shift
    ;;
  -s|--skip-git)
    SKIP_GIT=1
    shift
    ;;
  *) # unknown
    echo Unknown Parameter $1
    exit 4
  esac
done

echo "*************************************************"
echo "*    Create a ETI SRE template micro-service    *"
echo "*************************************************"
echo

if [ "$DRY_RUN" = 1 ]
then
  echo "!!! DRY RUN ONLY"
fi

if [ "$SKIP_GIT" = 1 ]
then
  echo "!!! SKIP GIT OPS"
fi

step "Verifying Pre-requisites"
verify_prerequisites

get_user_input

step "User Confirmation"
echo "***********************************************************"
echo "New micro-service Name     : $NEW_APP_NAME"
echo "***********************************************************"
echo

if [ -z "$NEW_APP_NAME" ]; then
  echo "Error: NEW_APP_NAME is not set."
  exit 1
fi

echo

if [ "$SKIP_PROMPT" = 0 ]
then
  user_confirmation "Please confirm to proceed with configuring this directory for \"$NEW_APP_NAME\" (y/N): "
fi

if [ "$DRY_RUN" = 1 ]
then
  echo
  echo "DRY RUN Complete"
  exit 0
fi

if [ -z $SKIP_GIT ]
then
  RANDOM_BRANCH_POSTFIX=$(openssl rand -hex 4)
  RANDOM_BRANCH=$NEW_APP_NAME-$RANDOM_BRANCH_POSTFIX
  step "Create a new git branch: $RANDOM_BRANCH"
  git checkout -b $RANDOM_BRANCH
fi

if [ "$IS_DEMO" = 1 ]
then
  DEMO_PREFIX='demo-'
else
  DEMO_PREFIX=''
fi

step "Update template for $NEW_APP_NAME"
find . -type f ! -name 'runme.sh' ! -name 'README.md' ! -path '*/.git/*' -exec $SED_BIN -i "s/platform-demo/${DEMO_PREFIX}${NEW_APP_NAME}/g" {} +
find . -type f ! -name 'runme.sh' ! -name 'README.md' ! -path '*/.git/*' -exec $SED_BIN -i "s/Platform Demo/Platform Demo ${NEW_APP_NAME}/g" {} +
find . -type d -iname '*platform-demo*' ! -path '*/.git/*' -depth -exec bash -c 'mv "$1" "${1/platform-demo/'${DEMO_PREFIX}${NEW_APP_NAME}'}"' -- '{}' ';'
find . -type f -iname '*platform-demo*' ! -path '*/.git/*' -depth -exec bash -c 'mv "$1" "${1/platform-demo/'${DEMO_PREFIX}${NEW_APP_NAME}'}"' -- '{}' ';'

rm -rf docs
echo "# $NEW_APP_NAME" > README.md

if [ -z $SKIP_GIT ]
then
  step "Commit changes to git"
  git config --global user.email "eti-sre-cicd.gen"
  git config --global user.name "Outshift Platform Jarvis Agent"
  if [ -n "$GITHUB_TOKEN" ]; then
    TOKEN=$GITHUB_TOKEN
  elif [ -n "$GH_TOKEN" ]; then
    TOKEN=$GH_TOKEN
  else
    echo "Error: Neither GITHUB_TOKEN nor GH_TOKEN is set."
    exit 1
  fi

  git config --global url."https://eti-sre-cicd.gen:$TOKEN@github.com/cisco-eti".insteadOf "https://github.com/cisco-eti"

  git add .
  git commit -m "$NEW_APP_NAME: Executed runme.sh to update template for $NEW_APP_NAME"

  step "Push changes to origin branch $RANDOM_BRANCH"
  REPO_NAME=$(basename -s .git `git config --get remote.origin.url`)
  git push https://eti-sre-cicd.gen:$TOKEN@github.com/cisco-eti/$REPO_NAME $RANDOM_BRANCH
fi
echo $RANDOM_BRANCH > .runme.branch
step "Done"

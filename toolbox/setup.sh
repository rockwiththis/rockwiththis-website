SOURCE="${BASH_SOURCE[0]}"

while [ -h "$SOURCE" ]; do # resolve $SOURCE until the file is no longer a symlink
  echo $SOURCE is a symlink
  DIR="$( cd -P "$( dirname "$SOURCE" )" && pwd )"
  SOURCE="$(readlink "$SOURCE")"
  [[ $SOURCE != /* ]] && SOURCE="$DIR/$SOURCE" # if $SOURCE was a relative symlink, we need to resolve it relative to the path where the symlink file was located
done

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" > /dev/null && pwd )"

# Variables
export GITHUB_ROOT="$DIR/.."
export ENV_CONFIG_FILE="$GITHUB_ROOT/config/production.js"

# Aliases
alias rwt="cd $GITHUB_ROOT"

echo "Rock With This environment loaded @ $GITHUB_ROOT"

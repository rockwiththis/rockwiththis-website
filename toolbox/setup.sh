SOURCE="${BASH_SOURCE[0]}"

while [ -h "$SOURCE" ]; do # resolve $SOURCE until the file is no longer a symlink
  echo $SOURCE is a symlink
  DIR="$( cd -P "$( dirname "$SOURCE" )" && pwd )"
  SOURCE="$(readlink "$SOURCE")"
  [[ $SOURCE != /* ]] && SOURCE="$DIR/$SOURCE" # if $SOURCE was a relative symlink, we need to resolve it relative to the path where the symlink file was located
done

DIR="$( dirname "$SOURCE" )"

# Variables
export GITHUB_ROOT="$DIR/.."

# Aliases
alias rwt="cd $GITHUB_ROOT"

echo "Rock With This environment loaded @ $GITHUB_ROOT"

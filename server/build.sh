# shell script to run cmake and make

show_help() {
    echo "Usage: $0 [options]"
    echo "Options:"
    echo "  -c    Clean build directory before building"
    echo "  -r    Run the executable after building"
    echo "  -h    Show this help message"
}

CLEAN=0
RUN=0

while getopts "crh" opt; do
  case $opt in
    c)
      CLEAN=1
      ;;
    r)
      RUN=1
      ;;
    h)
      show_help
      exit 0
      ;;
    *)
      show_help
      exit 1
      ;;
  esac
done

if [ $CLEAN -eq 1 ]; then
    echo "Cleaning build directory..."
    rm -rf build
fi

cmake -S . -B build
cmake --build build

if [ $RUN -eq 1 ]; then
    EXECUTABLE="server"
    if [ -n "$EXECUTABLE" ]; then
        echo "Running $EXECUTABLE..."
        ./build/$EXECUTABLE
    else
        echo "No executable found in build directory."
        exit 1
    fi
fi

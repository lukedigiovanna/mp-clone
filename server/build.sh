# shell script to run cmake and make

show_help() {
    echo "Usage: $0 [options]"
    echo "Options:"
    echo "  -c    Clean build directory before building"
    echo "  -r    Run the executable after building"
    echo "  -e    Build for Electron development (copies executable to Electron resources)"
    echo "  -h    Show this help message"
}

CLEAN=0
RUN=0
ELECTRON_PATH="/Users/lukedigiovanna/Programming/games/mario-party-clone/electron/node_modules/electron/dist/Electron.app/Contents/Resources"
BUILD_ELECTRON_DEV=0

while getopts "creh" opt; do
  case $opt in
    c)
      CLEAN=1
      ;;
    r)
      RUN=1
      ;;
    e)
      BUILD_ELECTRON_DEV=1
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

# If building for Electron development, copy the executable to the Electron resources directory
if [ $BUILD_ELECTRON_DEV -eq 1 ]; then
    echo $ELECTRON_PATH
    if [ -d "$ELECTRON_PATH" ]; then
        echo "Copying executable to Electron resources directory..."
        cp build/server "$ELECTRON_PATH/server"
    else
        echo "Electron resources directory not found. Skipping copy."
    fi
fi

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

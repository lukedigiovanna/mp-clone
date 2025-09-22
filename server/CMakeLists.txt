cmake_minimum_required(VERSION 3.10)
project(mario-party-clone-server)

# Enable C++20
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

# Include directories (adjust these paths as needed)
include_directories(${CMAKE_SOURCE_DIR}/dependencies/include)

# Add your source files
add_executable(server 
    src/main.cpp
    src/logger.cpp
)

# Link against Ws2_32.lib
if(WIN32)
    target_link_libraries(WebRTDB PRIVATE ws2_32 Mswsock)
endif()

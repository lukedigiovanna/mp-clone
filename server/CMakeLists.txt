# build src/main.cpp and include websocket library

cmake_minimum_required(VERSION 3.10)
project(mario-party-clone-server)
set(CMAKE_CXX_STANDARD 17)
add_executable(server src/main.cpp)
# target_include_directories(server PRIVATE ../external/websocketpp)
target_link_libraries(server PRIVATE pthread)
target_compile_options(server PRIVATE -Wall -Wextra -Wpedantic)
set_target_properties(server PROPERTIES OUTPUT_NAME "server")

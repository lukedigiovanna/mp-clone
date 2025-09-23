#include <stdio.h>
#include "logger.h"

#define ASIO_STANDALONE
#define _WEBSOCKETPP_CPP11_THREAD_

#include <websocketpp/config/asio_no_tls.hpp>
#include <websocketpp/server.hpp>
#include <asio.hpp>

using Server = websocketpp::server<websocketpp::config::asio>;

void onMessage(websocketpp::connection_hdl handle, Server::message_ptr msg) {
    LOG_INFO << "Received message: " << msg->get_payload();
}
void onOpen(websocketpp::connection_hdl handle) {
    LOG_INFO << "Connection opened";
}
void onClose(websocketpp::connection_hdl handle) {
    LOG_INFO << "Connection closed";
}

std::string get_local_ip_address() {
    asio::io_context ctx;
    asio::ip::udp::resolver resolver(ctx);
    asio::ip::udp::socket socket(ctx);
    asio::ip::udp::endpoint ep(asio::ip::address::from_string("8.8.8.8"), 53);

    socket.connect(ep);
    auto local_ep = socket.local_endpoint();
    std::string ip = local_ep.address().to_string();
    return ip;
}

int main(int argc, char* argv[]) {
    // Disable websocketpp logging.
    Server server;
    server.clear_access_channels(websocketpp::log::alevel::all);

    server.init_asio();
    server.set_reuse_addr(true);

    server.set_message_handler(onMessage);
    server.set_close_handler(onClose);
    server.set_open_handler(onOpen);

    server.listen(0);

    try {
        server.start_accept();

        // get port from server
        asio::error_code ec;
        auto endpoint = server.get_local_endpoint(ec);
        if (ec) {
            LOG_ERROR << "Error getting local endpoint: " << ec.message();
            return 1;
        }
        std::string ip = get_local_ip_address();
        uint16_t port = endpoint.port();

        std::cout << "{ \"ip\": \"" << ip << "\", \"port\": " << port << " }" << std::endl;

        LOG_INFO << "Listening for clients on " << ip << ":" << port;

        server.run();
    } catch (const websocketpp::exception &e) {
        LOG_ERROR << e.what();
    }

    return 0;
}
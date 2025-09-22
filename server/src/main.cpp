#include <stdio.h>
#include "logger.h"

#define ASIO_STANDALONE
#define _WEBSOCKETPP_CPP11_THREAD_

#include <websocketpp/config/asio_no_tls.hpp>
#include <websocketpp/server.hpp>

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
        uint16_t port = server.get_local_endpoint(ec).port();

        LOG_INFO << "Listening for clients on ::" << port;

        server.run();
    } catch (const websocketpp::exception &e) {
        LOG_ERROR << e.what();
    }

    return 0;
}
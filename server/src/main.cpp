#include <stdio.h>
#include "logger.h"

#define ASIO_STANDALONE
#define _WEBSOCKETPP_CPP11_THREAD_

#include <websocketpp/config/asio_no_tls.hpp>
#include <websocketpp/server.hpp>
#include <asio.hpp>

#include "nlohmann_json.hpp"

using json = nlohmann::json;

using Server = websocketpp::server<websocketpp::config::asio>;

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

class Player {
private:
    int characterId;
    int stars;
    int coins;
    bool isCPU;
    websocketpp::connection_hdl ws_handle;
public:
    Player() : characterId(0), stars(0), coins(0), isCPU(true) {

    }
    inline json get_json() const {
        return json{
            {"characterId", characterId},
            {"stars", stars},
            {"coins", coins},
            {"isCPU", isCPU},
        };
    }

    inline void set_ws_handle(websocketpp::connection_hdl ws_handle) {
        isCPU = false;
        this->ws_handle = ws_handle;
    }
};

enum Phase {
    LOBBY, BOARD,
};
const std::string phase_string[2] = {"lobby", "board"};

// the high level game manager. will deal with states and whatever as needed
class Game {
private:
    Server& server;
    Phase phase;

    std::array<Player, 4> players;
    int humanPlayers = 0;
    int tick = 0;
    std::vector<websocketpp::connection_hdl> connections;
public:
    Game(Server& server) : phase(LOBBY), server(server) {
        
    }

    void broadcast_state() {
        for (const auto& hdl : connections) {
            this->server.send(hdl, get_state_json().dump(), websocketpp::frame::opcode::text);
        }
    }

    void on_client_connect(websocketpp::connection_hdl handle) {
        LOG_INFO << "client connected...";
        if (humanPlayers >= 4) {
            this->server.send(handle, "too many players", websocketpp::frame::opcode::text);
            return;
        }
        players[humanPlayers].set_ws_handle(handle);
        humanPlayers++;
        this->connections.push_back(handle);
        tick++;
        broadcast_state();
    }

    void on_client_message(websocketpp::connection_hdl handle, Server::message_ptr msg) {
        LOG_INFO << "Received message: " << msg->get_payload();
    }

    void on_client_disconnect(websocketpp::connection_hdl handle) {
        LOG_INFO << "Connection closed";

    }

    inline json get_state_json() {
        json data = {};
        json player_array = json::array();
        for (const auto& player : players) {
            player_array.push_back(player.get_json());
        }
        return json{
            {"phase", phase_string[phase]},
            {"players", player_array},
            {"data", data},
            {"tick", tick},
        };
    }
};

int main(int argc, char* argv[]) {
    Server server;
    Game game(server);
    server.clear_access_channels(websocketpp::log::alevel::all);

    server.init_asio();
    server.set_reuse_addr(true);

    server.set_message_handler([&game](websocketpp::connection_hdl hdl, Server::message_ptr msg) { 
        game.on_client_message(hdl, msg);
    });
    server.set_open_handler([&game](websocketpp::connection_hdl hdl) { 
        game.on_client_connect(hdl); 
    });
    server.set_close_handler([&game](websocketpp::connection_hdl hdl) {
        game.on_client_disconnect(hdl);
    });

    server.listen(0);

    LOG_INFO << game.get_state_json().dump();

    try {
        server.start_accept();

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
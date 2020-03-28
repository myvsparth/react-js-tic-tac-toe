import React, { Component, Fragment } from 'react';
import { Table, Row, Col } from 'react-bootstrap';
import './GamePlay.css';
class GamePlay extends Component {
    constructor() {
        super();
        this.state = {
            gameData: null
        }
    }
    componentDidMount() {
        console.log(this.props);
        this.setState({
            gameData: this.props.gameData,
            gameId: this.props.gameId,
            gameBetweenSeconds: 10,
        });

        this.props.socket.on('selectCellResponse', data => {
            // console.log(data);
            this.setState({
                gameData: data
            });
        });
        this.props.socket.on('gameInterval', data => {
            // console.log(data);
            this.setState({
                gameBetweenSeconds: data
            });
        });
        this.props.socket.on('nextGameData', data => {
            // console.log(data);
            this.setState({
                gameId: data.game_id,
                gameData: data.game_data,
                gameBetweenSeconds: 10,
            });
        });
        this.props.socket.on('opponentLeft', data => {
            this.props.opponentLeft();
        });
    }
    selectCell = (i, j) => {
        this.props.socket.emit('selectCell', { gameId: this.state.gameId, "i": i, "j": j });
    };

    generateCellDOM = () => {
        console.log(this.state.gameData);
        let table = []
        for (let i = 0; i < 3; i++) {
            let children = []
            for (let j = 0; j < 3; j++) {
                var showWinnerCell = false;
                if (this.state.gameData.game_status === "won") {
                    for (let k = 0; k < this.state.gameData.winning_combination.length; k++) {
                        if (i === this.state.gameData.winning_combination[k][0] && j === this.state.gameData.winning_combination[k][1]) {
                            showWinnerCell = true;
                            break;
                        }
                    }
                }
                children.push(<td key={"cell" + i + j} className={showWinnerCell ? "winner-cell" : ""} ><div key={"cell-div" + i + j} className={"cell cell-" + this.state.gameData.playboard[i][j]} onClick={(this.state.gameData.game_status !== "ongoing" || this.props.socket.id !== this.state.gameData.whose_turn || this.state.gameData.playboard[i][j] ? () => void (0) : () => this.selectCell(i, j))}></div></td>)
            }
            table.push(<tr key={"row" + i} >{children}</tr>)
        }
        return table
    }

    render() {
        return (

            this.state.gameData ? <Fragment>
                <Row>
                    <Col>
                        <p className={"text-center " + (this.props.socket.id !== this.state.gameData.whose_turn ? "active-player" : "")}>
                            {this.props.socket.id === this.state.gameData.player1 ? (this.state.gameData.game_status === "won" && this.state.gameData.game_winner === this.state.gameData.player2 ? "Opponent is Winner!!! " : " ") + this.state.gameData[this.state.gameData.player2].mobile_number + " | Played : " + this.state.gameData[this.state.gameData.player2].played + " | Won : " + this.state.gameData[this.state.gameData.player2].won + " | Draw : " + this.state.gameData[this.state.gameData.player2].draw : (this.state.gameData.game_status === "won" && this.state.gameData.game_winner === this.state.gameData.player1 ? "Opponent is Winner!!! " : " ") + this.state.gameData[this.state.gameData.player1].mobile_number + " | Played : " + this.state.gameData[this.state.gameData.player1].played + " | Won : " + this.state.gameData[this.state.gameData.player1].won + " | Draw : " + this.state.gameData[this.state.gameData.player1].draw}
                        </p>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Table bordered>
                            <tbody>
                                {
                                    this.generateCellDOM()
                                }
                            </tbody>
                        </Table>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <p className={"text-center " + (this.props.socket.id === this.state.gameData.whose_turn ? "active-player" : "")}>{
                            this.props.socket.id === this.state.gameData.player1 ? (this.state.gameData.game_status === "won" && this.state.gameData.game_winner === this.state.gameData.player1 ? "You are Winner!!! " : " ") + this.state.gameData[this.state.gameData.player1].mobile_number + " | Played : " + this.state.gameData[this.state.gameData.player1].played + " | Won : " + this.state.gameData[this.state.gameData.player1].won + " | Draw : " + this.state.gameData[this.state.gameData.player1].draw : (this.state.gameData.game_status === "won" && this.state.gameData.game_winner === this.state.gameData.player2 ? "You are Winner!!! " : " ") + this.state.gameData[this.state.gameData.player2].mobile_number + " | Played : " + this.state.gameData[this.state.gameData.player2].played + " | Won : " + this.state.gameData[this.state.gameData.player2].won + " | Draw : " + this.state.gameData[this.state.gameData.player2].draw}
                        </p>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <p className="text-center">
                            {this.state.gameData.game_status === "won" ? "New Game will be start in " + this.state.gameBetweenSeconds + " seconds." : ""}
                        </p>
                    </Col>
                </Row>
            </Fragment> : <p>Gathering Data</p>

        );
    }
}

export default GamePlay;
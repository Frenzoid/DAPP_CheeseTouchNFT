import React, { Component } from 'react';
import moment from 'moment';
import Identicon from 'identicon.js';

class Main extends Component {
    constructor() {
        super();
        this.transferHistory = null;
        this.lastTransferedDate = null;
        this.userCounter = null;
        this.isCurrentUserOwner = null;
        this.isAlive = null;
        this.state = { timeDiff: moment(), coutDown: null };
    }

    async componentWillMount() {
        // Grabs props, puts them on a component level and shorted named variables.
        this.transferHistory = this.props.contractData.transferHistory;
        this.lastTransferedDate = this.props.contractData.lastTransferedDate;
        this.userCounter = this.props.contractData.userCounter;

        // Checks if token is alive.
        if (moment(this.lastTransferedDate * 1000).add(1, 'days') >= moment()) this.isAlive = true;
        else this.isAlive = false;

        // Checks if the current user is the owner.
        if (this.userCounter > 0 &&
            this.transferHistory[this.userCounter - 1].user === this.props.account) this.isCurrentUserOwner = true;
        else this.isCurrentUserOwner = false;

        // Set time left until expiration.
        let timeLeft = moment(this.lastTransferedDate * 1000).add(1, 'days').diff(moment());
        this.setState({ timeDiff: moment.duration(timeLeft) })
        this.setState({ coutDown: moment.duration(timeLeft).hours() + ":" + moment.duration(timeLeft).minutes() + ":" + moment.duration(timeLeft).seconds() })
    }

    // A function that gets triggered when the form gets submited.
    parseSubmitTransfer = (event) => {

        // Prevents default operation of the event, in this case the form's sumbit event.
        event.preventDefault()

        // Grab data from inputs, check the "ref" attributes on each field.
        const address = this.address.value

        // Runs the parent function with the values sent.
        this.props.transfer(address)
    };

    render() {
        return (
            <div className="container-fluid">
                <div className="container">
                    <main role="main" className="ml-auto mr-auto">
                        <div className="mr-auto ml-auto">
                            <p>&nbsp;</p>
                            <div className="text-center">
                                <h1>CheeseTouch NFT</h1>
                                {this.isAlive ? <h2>Time left until the cheese expires: <span className="text-danger">{this.state.coutDown}</span></h2> : ""}
                                <img src="https://i.giphy.com/media/l2YOwxArJJabWRBo4/giphy.webp" alt="cheese" />
                                <h5>
                                    There's only one. Don't let it rot!
                                </h5>
                                <p>
                                    There's only one Slice of cheese left! (NFT token), only one user can hold it, but if the holder holds it for more than 24hrs, it expires!
                                </p>
                                <i>Trade the token to keep it fresh!</i>
                            </div>

                            <hr></hr>
                            {
                                this.isAlive
                                    ?
                                    this.isCurrentUserOwner ?
                                        <div className="text-center">
                                            <h4 className="text-primary">You're the current owner of the only slice of cheese in the internet!</h4>
                                            <form onSubmit={this.parseSubmitTransfer} >
                                                <div className="form-group mr-sm-2">
                                                    <input
                                                        id="transfer"
                                                        type="text"
                                                        ref={(input) => { this.address = input }}
                                                        className="form-control ml-auto"
                                                        placeholder="Cheese Reciever Address: 0x12313...."
                                                        required />
                                                </div>
                                                <button type="submit" class="btn btn-primary btn-block btn-lg">Transfer Cheese Slice!</button>
                                            </form>
                                        </div>
                                        :
                                        ""
                                    :
                                    <div>
                                        <h4 className="text-center">It seems that there's no one holding the holycheese right now, quickcly! grab it! FREE CHEESE!!</h4>
                                        <button onClick={this.props.mint} class="btn btn-primary btn-block btn-lg">
                                            MINT SLICE OF CHEESE
                                        </button>
                                    </div>
                            }

                            <h4 className="mt-3">Transfer History:</h4>
                            <div className="d-flex flex-column text-primary justify-content-between">
                                <div className="d-flex flex-row text-primary justify-content-between">
                                    <div>
                                        User:
                                    </div>
                                    <div>
                                        Recived date
                                    </div>
                                    <div>
                                        Sent date
                                    </div>
                                </div>

                                {
                                    this.transferHistory.length > 0 ?
                                        this.transferHistory.sort((a, b) => b.startHoldDate - a.startHoldDate).map((userObject) => {
                                            return (
                                                <div className="d-flex flex-row text-dark justify-content-between">
                                                    <div className="mr-auto">
                                                        <img
                                                            alt={this.props.account}
                                                            className='ml-2'
                                                            width='30'
                                                            height='30'
                                                            src={`data:image/png;base64,${new Identicon(userObject.user, 30).toString()}`}
                                                        />
                                                        {userObject.user.substring(0, 10) + "..."}
                                                    </div>
                                                    <div>
                                                        {moment(userObject.startHoldDate * 1000).calendar()}
                                                    </div>
                                                    <div className="ml-auto">
                                                        {+userObject.endHoldDate !== 0 ? moment(userObject.endHoldDate * 1000).calendar() : "Still Holding!"}
                                                    </div>
                                                </div>
                                            )
                                        })
                                        :
                                        <h6>This slice hasn't been transfered to anyone yet!</h6>
                                }
                            </div>
                        </div>
                    </main>
                </div>
            </div >
        )
    }
}

export default Main;
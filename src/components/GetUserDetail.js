import React, { Component } from 'react';
import { Form, Button } from 'react-bootstrap';
class GetUserDetail extends Component {
    constructor() {
        super();
        this.state = {
            mobileNumber: "1234567890"
        };
    }
    componentDidMount() {
        this.props.socket.on('checkUserDetailResponse', data => {
            console.log(data);
            this.props.registrationConfirmation(data);
        });
    }
    submitMobileNumber = () => {
        this.props.socket.emit('checkUserDetail', { "mobileNumber": this.state.mobileNumber });
    };
    onMobileNumberChange = (e) => {
        this.setState({ mobileNumber: e.target.value });
    };
    render() {
        return (
            <Form>
                <Form.Group>
                    <Form.Label>Enter Your Mobile Number</Form.Label>
                    <Form.Control type="number" value={this.state.mobileNumber} onChange={this.onMobileNumberChange} placeholder="Enter Mobile" />
                    <Form.Text className="text-muted">
                        Enter Your Mobile Number
                    </Form.Text>
                    <Button disabled={this.state.mobileNumber.length !== 10} onClick={this.submitMobileNumber} variant="primary" type="button">
                        Submit
                    </Button>
                </Form.Group>
            </Form>

        );
    }
}

export default GetUserDetail;
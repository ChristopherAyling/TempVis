import Layout from '../components/layout'
import io from 'socket.io-client'

class Index extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            socket: null
        }
    }

    componentDidMount = () => {
        const socket = io("localhost:3000")
        socket.on('hello_world', (data) => {
            console.log(data);
            
        })
        this.setState()
    }

    render() {
        return (
            <Layout>
                Hello I am temperature
            </Layout>
        )
    }
}

export default Index

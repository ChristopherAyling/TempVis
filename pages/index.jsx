import Layout from '../components/layout';
import io from 'socket.io-client'
import { LineChart, Line, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import regression from 'regression'

const dataToLoad = [
  {time: 1, c0: 40, c1: 30, c2: 15, c3: 45, c4: 25},
  {time: 2, c0: 30, c1: 40, c2: 24, c3: 50, c4: 16},
  {time: 3, c0: 20, c1: 27, c2: 18, c3: 30, c4: 19},
  {time: 4, c0: 27, c1: 40, c2: 30, c3: 35, c4: 22},
  {time: 5, c0: 18, c1: 50, c2: 24, c3: 22, c4: 24},
  {time: 6, c0: 23, c1: 18, c2: 18, c3: 30, c4: 28},
  {time: 7, c0: 34, c1: 22, c2: 16, c3: 32, c4: 33}
];

const getKeysValues = (key, data) => data.map(row => [row['time'], row[key]]) 

class Index extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      data: dataToLoad,
      predicted: null,
      socket: null
    };
  }

    componentDidMount = () => {
        const socket = io("localhost:3000")

        socket.on('update', (data) => {
            this.setState(prevState => ({
                data: [...prevState.data, ...data]
            }))
            // this.state.data[0].
            let train = getKeysValues('c0', this.state.data)
            console.log(train)
            let result = regression.linear(train)
            console.log(result)
            console.log(result.predict(8))
        })
    }

  render() {
    return (
      <Layout>
        <h1>Temperature</h1>
        <ResponsiveContainer width='100%' aspect={3.0/2.0}>
          <LineChart height={300} data={this.state.data}>
            <defs>
              <linearGradient id="colorC" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ef5350" />
                <stop offset="100%" stopColor="#42a5f5" />
              </linearGradient>
            </defs>
            <Line type="monotone" dataKey="c0" stroke="url(#colorC)" strokeWidth={3} isAnimationActive={true}/>
            <Line type="monotone" dataKey="c1" stroke="url(#colorC)" strokeWidth={3} isAnimationActive={true}/>
            <Line type="monotone" dataKey="c2" stroke="url(#colorC)" strokeWidth={3} isAnimationActive={true}/>
            <Line type="monotone" dataKey="c3" stroke="url(#colorC)" strokeWidth={3} isAnimationActive={true}/>
            <Line type="monotone" dataKey="c4" stroke="url(#colorC)" strokeWidth={3} isAnimationActive={true}/>
            <XAxis dataKey="time" />
            <YAxis domain={[10, 50]} />
          </LineChart>  
        </ResponsiveContainer>
      </Layout>
    )
  }
}

export default Index

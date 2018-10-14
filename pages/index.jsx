import Layout from '../components/layout';
import io from 'socket.io-client'
import { LineChart, Line, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import regression from 'regression'

// const dataToLoad = [
//   {time: 1, c0: 40, c1: 30, c2: 15, c3: 45, c4: 25},
//   {time: 2, c0: 30, c1: 40, c2: 24, c3: 50, c4: 16},
//   {time: 3, c0: 20, c1: 27, c2: 18, c3: 30, c4: 19},
//   {time: 4, c0: 27, c1: 40, c2: 30, c3: 35, c4: 22},
//   {time: 5, c0: 18, c1: 50, c2: 24, c3: 22, c4: 24},
//   {time: 6, c0: 23, c1: 18, c2: 18, c3: 30, c4: 28},
//   {time: 7, c0: 34, c1: 22, c2: 16, c3: 32, c4: 33}
// ];

// const dataToLoad = [
//   {time: 0, 'c0': 30},
//   {time: 1, 'c0': 40},
//   {time: 1, 'c0': 50, 'c0p': 50},
//   {time: 2, 'c0p': 60}
// ]

const dataToLoad = [
  {time: 0, 'c0': 30},
  {time: 1, 'c0': 40},
  {time: 2, 'c0': 50},
  {time: 3, 'c0': 40}
]

class Predictor {
  constructor(data) {
    console.log(data)
    this.x = data.map(row => row[0])
    this.y = data.map(row => row[1])
  }

  predictNext() {
    let train = []
    for (var i=0; i<this.x.length; i++) {
      train[i] = [this.x[i], this.y[i]]
    }
    if (train.length > 3) {
      train = train.slice(Math.max(train.length - 3, 1))
    }
    console.log("train"+train)
    let regressor = regression.linear(train, {order: 3})
    let pred = regressor.predict(this.x[this.x.length-1]+1)
    console.log("pred"+pred)
    return pred
  }

  getDataForChart() {
    let prediction = this.predictNext()
    console.log(prediction)
    let chartData = []
    for (var i=0; i< this.x.length; i++) {
      chartData.push({time: this.x[i], 'c0': this.y[i]})
    }
    chartData[chartData.length-1]['c0p'] = chartData[chartData.length-1]['c0']
    chartData.push({time: this.x[this.x.length-1]+1, 'c0p': prediction[1]})
    console.log(chartData)
    return chartData
  }
}

const getKeysValues = (key, data) => data.map(row => [row['time'], row[key]]) 

class Index extends React.Component {

  constructor(props) {
    super(props)
    let data = [{time: 0, c0: 30}]
    this.state = {
      data: data,
      prediction: [
        Object.assign({}, data[data.length-1], {c0p: data[data.length-1]['c0']}),
        {time: 1, c0p: 30}
      ]
    };
  }

    componentDidMount = () => {
        const socket = io("/")

        socket.on('update', (data) => {
            this.setState(prevState => {
              let newData = [...prevState.data, ...data]
              let predictor = new Predictor(getKeysValues('c0', newData))
              let pred = predictor.predictNext()
              let prediction = [
                Object.assign({}, newData[newData.length-1], {c0p: newData[newData.length-1]['c0']}),
                {time: newData[newData.length-1]['time']+1, c0p: pred[1]}
              ]
              console.log(prediction);
              return {
                data: train.slice(Math.max(train.length - 3, 1)),
                prediction: prediction
              }
            })

            
        })
    }

  render() {
    return (
      <Layout>
        <h1>Temperature</h1>
        <ResponsiveContainer width='100%' aspect={3.0/2.0}>
          <LineChart height={300} data={[...this.state.data.slice(0, -1), ...this.state.prediction]}>
            <defs>
              <linearGradient id="colorC" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ef5350" />
                <stop offset="100%" stopColor="#42a5f5" />
              </linearGradient>
            </defs>
            <Line type="monotone" dataKey="c0" stroke="url(#colorC)" strokeWidth={3} isAnimationActive={true}/>
            {/* <Line type="monotone" dataKey="c1" stroke="url(#colorC)" strokeWidth={3} isAnimationActive={true}/>
            <Line type="monotone" dataKey="c2" stroke="url(#colorC)" strokeWidth={3} isAnimationActive={true}/>
            <Line type="monotone" dataKey="c3" stroke="url(#colorC)" strokeWidth={3} isAnimationActive={true}/>
            <Line type="monotone" dataKey="c4" stroke="url(#colorC)" strokeWidth={3} isAnimationActive={true}/> */}
            <Line type="monotone" dataKey="c0p" stroke="url(#colorC)" strokeWidth={3} isAnimationActive={true} strokeDasharray="5 5"/>
            
            <XAxis dataKey="time" />
            <YAxis domain={[10, 50]} />
          </LineChart>  
        </ResponsiveContainer>
      </Layout>
    )
  }
}

export default Index

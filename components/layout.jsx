import Head from 'next/head'

const Layout = (props) => (
    <div>
        <Head>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <title>TempVis</title>
            <link rel="stylesheet" href="/static/style.css"/>
        </Head>
        
        <div className="container">
            {props.children}
        </div>
    </div>
)

export default Layout
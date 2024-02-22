import '../css/LoadingPage.css';

function LoadingPage () {
    return(
        <div className='LoadingPage'>
            <div style={{height: '100px'}}></div>
            <div className="spinner" />
            <div style={{height: '50px'}}></div>
            <h1>Submitting Form</h1>
        </div>
    );
}

export default LoadingPage;
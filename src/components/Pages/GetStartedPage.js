import '../../css/GetStartedPage.css';

function GetStartedPage ({logo}) {
    return(
        <div className='GetStartedPage'>
            <div style={{height: '100px'}}></div>
            <img src={logo} className="logo" alt="logo" />
            <h1>Welcome To NTCA</h1>
            <p>Report instances of diseases found in cattle in the Northern Territory</p>
        </div>
    );
}

export default GetStartedPage;
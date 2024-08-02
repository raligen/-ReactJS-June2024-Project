export default function Categories() {
    return (
        <>
        <div id="carouselExampleIndicators" className="carousel slide" data-ride="carousel">
        <ol className="carousel-indicators">
          <li data-target="#carouselExampleIndicators" data-slide-to="0" className="active"></li>
          <li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
          <li data-target="#carouselExampleIndicators" data-slide-to="2"></li>
        </ol>
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img className="d-block w-100" src="client\public\assets\img\katie-moum-politics.jpg" alt="Politics"/>
            <div className="carousel-caption d-none d-md-block">
                <h5>Politics</h5>
                <p>Learn more about latest political developments.</p>
            </div>   
          </div>
          <div className="carousel-item">
            <img className="d-block w-100" src="client\public\assets\img\john-schnobrich-business.jpg" alt="Business"/>
            <div className="carousel-caption d-none d-md-block">
                <h5>Business</h5>
                <p>Click here for latest news and analyses on investment and entrepreneurship.</p>
            </div>   
          </div>
          <div className="carousel-item">
            <img className="d-block w-100" src="/client/public/assets/img/alexander-shatov-technology.jpg." alt="Technology"/>
            <div className="carousel-caption d-none d-md-block">
                <h5>Technology</h5>
                <p>Innovation never sleeps. Click here to learn more.</p>
            </div>                
          </div>
        </div>
        <a className="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="sr-only">Previous</span>
        </a>
        <a className="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="sr-only">Next</span>
        </a>
      </div>
      </>
    );
}
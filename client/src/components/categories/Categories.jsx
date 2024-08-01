export default function Categories(){
    return (
        <div id="carouselExampleIndicators" class="carousel slide carousel-fade" data-ride="carousel">
        <ol class="carousel-indicators">
            <li data-target="#carouselExampleIndicators" data-slide-to="0" class="active"></li>
            <li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
            <li data-target="#carouselExampleIndicators" data-slide-to="2"></li>
        </ol>
        <div class="carousel-inner shadow-sm rounded">
            <div class="carousel-item active">
                <img class="d-block w-100" src="assets/img/demo/slide1.jpg" alt="First slide"/>
                <div class="carousel-caption d-none d-md-block">
                    <h5>Mountains, Nature Collection</h5>
                </div>
            </div>
            <div class="carousel-item">
                <img class="d-block w-100" src="assets/img/demo/slide2.jpg" alt="Second slide"/>
                <div class="carousel-caption d-none d-md-block">
                    <h5>Freedom, Sea Collection</h5>
                </div>
            </div>
            <div class="carousel-item">
                <img class="d-block w-100" src="assets/img/demo/slide3.jpg" alt="Third slide"/>
                <div class="carousel-caption d-none d-md-block">
                    <h5>Living the Dream, Lost Island</h5>
                </div>
            </div>
        </div>
        </div>
    );
}
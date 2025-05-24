import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
function HorizontalSwipe(prop){
    var settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 2,
        slidesToScroll: 1,
      };
    return(
        <Slider {...settings}>
          {prop.children}
        </Slider>
    )
}
export default HorizontalSwipe;

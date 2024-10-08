// react
import React, { Component } from 'react';

// third-party
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// application
import departmentsAria from '../../services/departmentsArea';
import SlickWithPreventSwipeClick from '../shared/SlickWithPreventSwipeClick';


const slickSettings = {
  dots: true,
  arrows: false,
  infinite: true,
  speed: 400,
  slidesToShow: 1,
  slidesToScroll: 1,
};

export default class BlockSlideShow extends Component {
  departmentsAreaRef = null;

  media = window.matchMedia('(min-width: 992px)');

  slides = [
    {
      // title: 'Big choice of<br>Plumbing products',
      // text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.<br>Etiam pharetra laoreet dui quis molestie.',
      image_classic: 'https://ananas.vn/wp-content/uploads/Banner_Sale-off-1.jpg',
      image_full: 'https://ananas.vn/wp-content/uploads/Banner_Sale-off-1.jpg',
      image_mobile: 'https://ananas.vn/wp-content/uploads/Banner_Sale-off-1.jpg',
    },
    {
      // title: 'Screwdrivers<br>Professional Tools',
      // text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.<br>Etiam pharetra laoreet dui quis molestie.',
      image_classic: 'https://ananas.vn/wp-content/uploads/Web1920-1.jpeg',
      image_full: 'https://ananas.vn/wp-content/uploads/Web1920-1.jpeg',
      image_mobile: 'https://ananas.vn/wp-content/uploads/Web1920-1.jpeg',
    },
    {
      // title: 'One more<br>Unique header',
      // text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.<br>Etiam pharetra laoreet dui quis molestie.',
      image_classic: 'https://ananas.vn/wp-content/uploads/Hi-im-Mule_1920x1050-Desktop.jpg',
      image_full: 'https://ananas.vn/wp-content/uploads/Hi-im-Mule_1920x1050-Desktop.jpg',
      image_mobile: 'https://ananas.vn/wp-content/uploads/Hi-im-Mule_1920x1050-Desktop.jpg',
    },
  ];

  componentDidMount() {
    if (this.media.addEventListener) {
      this.media.addEventListener('change', this.onChangeMedia);
    } else {
      this.media.addListener(this.onChangeMedia);
    }
  }

  componentWillUnmount() {
    departmentsAria.area = null;

    if (this.media.removeEventListener) {
      this.media.removeEventListener('change', this.onChangeMedia);
    } else {
      this.media.removeListener(this.onChangeMedia);
    }
  }

  onChangeMedia = () => {
    if (this.media.matches) {
      departmentsAria.area = this.departmentsAreaRef;
    }
  };

  setDepartmentsAreaRef = (ref) => {
    this.departmentsAreaRef = ref;

    if (this.media.matches) {
      departmentsAria.area = this.departmentsAreaRef;
    }
  };

  render() {
    const { withDepartments } = this.props;

    const blockClasses = classNames(
      'block-slideshow block',
      {
        'block-slideshow--layout--full': !withDepartments,
      },
    );

    const layoutClasses = classNames(
      'col-12',
    );

    const slides = this.slides.map((slide, index) => {
      const image = withDepartments ? slide.image_classic : slide.image_full;

      return (
        <div key={index} className="block-slideshow__slide">
          <div
            className="block-slideshow__slide-image block-slideshow__slide-image--desktop"
            style={{
              backgroundImage: `url(${image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              width: "100%"
            }}
          />
          <div
            className="block-slideshow__slide-image block-slideshow__slide-image--mobile"
            style={{
              backgroundImage: `url(${image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              width: "100%"
            }}
          />
          <div className="block-slideshow__slide-content">
            <div
              className="block-slideshow__slide-title"
              dangerouslySetInnerHTML={{ __html: slide.title }}
            />
            <div
              className="block-slideshow__slide-text"
              dangerouslySetInnerHTML={{ __html: slide.text }}
            />
            {/*
            <div className="block-slideshow__slide-button">
              <Link to="/" className="btn btn-primary btn-lg">Shop Now</Link>
            </div>
            */}
          </div>
        </div>
      );
    });

    return (
      <div className={blockClasses}>
        <div className="container-slide">
          <div className="row">
            <div className={layoutClasses}>
              <div className="block-slideshow__body">
                <SlickWithPreventSwipeClick {...slickSettings}>
                  {slides}
                </SlickWithPreventSwipeClick>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

BlockSlideShow.propTypes = {
  withDepartments: PropTypes.bool,
};

BlockSlideShow.defaultProps = {
  withDepartments: false,
};

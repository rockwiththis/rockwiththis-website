import React, { Component, Fragment } from 'react';
import Head from 'next/head';
import { CONNECT } from 'constants/page-names';

import Header from 'components/header';
import SocialLinks from 'components/header/social-links.js';
import EmailJoinForm from 'components/connect/email-join-form.js';

const diagTallImage = '/static/images/blue-logo-image-grid.png';
const gridPicImage = '/static/images/collage-full.png';
const colorFullImage = '/static/images/connectColors.png';
const color1Image = '/static/images/connectColors.png';

export default class ConnectPage extends Component {

  render = () => (
      <div className="connect-page">
        <head>
          <title>Rock With This</title>
        </head>

        <Header pageName={CONNECT} />
        <SocialLinks />

        <div className="content">
          <div className="top-content-container">
            <img className="background-color top" src={color1Image} />

            <div className="top-content">

              <img className="grid-pic" src={gridPicImage} />

              <div className="text">
                <h3>HUMAN RHYTHMS.</h3>
                <h3>NOT ALGORITHMS.</h3>
                <p className="mission">{"The mission of Rock With This is simple - to help you discover your new favorite songs."}</p>
                <hr />
                <p className="join-us">{"Join us for daily songs, fresh playlists, and free tix to sold out shows!"}</p>

                <EmailJoinForm
                  action='https://rockwiththis.us17.list-manage.com/subscribe/post?u=bfac2b1c3906a8dba6db52ab1&amp;id=ddc17b51d2'
                  fields={[{
                    name: 'EMAIL',
                    placeholder: 'Email',
                    type: 'email',
                    required: true
                  }]}
                  className='rwt-email-form'
                />
              </div>

            </div>

            <img className="background-color bottom" src={colorFullImage} />
          </div>

          <div className="bottom-content-container">
            <img className="background-blue" src={diagTallImage} />
            
            <div className="bottom-content">
              <h1>{"We don't have every song..."}</h1>
              <h1>{"Just the best you haven't heard."}</h1>

              <p>{"Our team consists of huge music lovers who spend hours each day digging through tracks, to deliver the best of what's breaking and uncover the left behind tracks that need to be heard."} </p>
            </div>
          </div>
        </div>

        <style jsx>{`
          .content {
            width: 100vw;
            overflow-x: hidden;
            /overflow-y: scroll;
            max-width: 1686px;
            margin: 0 auto;
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
          .content::-webkit-scrollbar {
            width: 0px;
          }
          .top-content-container {
            position: relative;
            width: 100%;
          }
          .background-color.top {
            position: absolute;
            top: -200px;
            right: 0;
            width: 800px;
          }
          .top-content {
            margin: 0 auto;
            width: 1150px;
            max-width: 100%;
            padding-top: 20px;
            position: relative;
            z-index: 3;
          }
          .grid-pic {
            width: 50%;
            padding-right: 25px;
            box-sizing: border-box;
          }
          .text {
            display: inline-block;
            vertical-align: top;
            width: 50%;
            padding-left: 25px;
            box-sizing: border-box;
            padding-top: 120px;
          }
          .text h3 {
            font-size: 40px;
            text-transform: uppercase;
            font-weight: 700;
            line-height: 50px;
            margin: 0;
          }
          .text p {
            font-size: 20px;
            line-height: 30px;
            font-weight: 400;
          }
          .text p.mission {
            font-weight 700;
          } 
          .background-color.bottom {
            transform: rotate(180deg);
            width: 650px;
            position: absolute;
            left: 0;
            bottom: -160px;
            z-index: 2;
          }
          .bottom-content-container {
            width: 100%;
            position: relative;
            overflow-x: hidden;
            height: 1029px;
          }
          .background-blue {
            position: absolute;
            top: 0;
          }
          .bottom-content {
            width: 100%;
            max-width: 900px;
            padding: 250px 100px 100px 60px;
            box-sizing: border-box;
            color: white;
            position: relative;
            z-index: 2;
          }
          .bottom-content h1 {
            font-size: 40px;
            line-height: 50px;
            text-transform: uppercase;
            margin: 0;
          }
          .bottom-content p {
            font-size: 24px;
            line-height: 34px;
          }
          @media (max-width: 1250px) {
            .top-content {
              width: 950px;
            }
          }
          @media (max-width: 1050px) {
            .grid-pic {
              display: none;
            }
            .text {
              padding-top: 60px;
              text-align: center;
              display: block;
              margin: 0 auto;
              padding-left: 0px;
              width: 90%;
              max-width: 600px;
            }
          }
          @media (max-width: 800px) {
            .background-blue {
              width: 1200px;
              top: 20px;
            }
            .bottom-content {
              width: 100%;
              max-width: 550px;
              padding: 170px 40px 0 40px;
            }
            .bottom-content h1 {
              font-size: 30px;
              line-height: 40px;
            }
            .bottom-content p {
              font-size: 20px;
              line0height: 28px;
            }
          }
          @media (max-width: 500px) {
            .bottom-content {
              padding-top: 140px;
            }
          }
          @media (max-width: 400px) {
            .bottom-content p {
              display: none;
            }
            .bottom-content {
              padding-top: 200px;
            }
          }
        `}</style>
        <style jsx global>{`
          .connect-page .social-links {
            padding-top: 75px;
            position: relative;
            z-index: 2;
          }
        `}</style>
      </div>
  )
}

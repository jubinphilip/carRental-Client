import React from "react";
import styled from "styled-components";

const Loader = () => {
  return (
    <StyledWrapper>
      <div className="div">
        <p id="h2">
          Loading....<span id="lol" />
        </p>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* Full height of the viewport */
  width: 100vw; /* Full width of the viewport */


  #h2 {
    color: white;
    mix-blend-mode: difference; /* Changes color of loading text */
    text-align: center;
    margin: 0;
    font-size: 12px;
    line-height: 30px;
    font-family: Arial, Helvetica, sans-serif;
    text-shadow: 0 0 3px;
    padding: 0;
    letter-spacing: 5px;
  }

  .div {
    position: relative;
    max-width: 200px;
    width: 100%;
    height: 30px;
    background: linear-gradient(to right, white, black);
    background-size: 200% 100%;
    border-radius: 10px;
    box-shadow: 0 0 3px;
    -webkit-box-reflect: below 1px
      linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.4));
    animation: gradientAnimation 10s linear infinite reverse;
  }

  @keyframes gradientAnimation {
    0% {
      background-position: 0;
    }
    100% {
      background-position: 200% 0;
    }
  }

  /* Use media queries for responsiveness */
  @media (max-width: 768px) {
    .div {
      width: 500px; /* Adjust width for smaller screens */
    }
  }
`;

export default Loader;

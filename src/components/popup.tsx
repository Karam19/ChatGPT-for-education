import styled from "styled-components";
export const TrueButton = styled.div`
  background: green;
  padding: 10px;
  margin-left: auto;
  margin-right: auto;
  cursor: pointer;
  width: 90px;
  text-align: center;
  float: left;
`;
export const FalseButton = styled.div`
  background: red;
  padding: 10px;
  margin-left: auto;
  margin-right: auto;
  cursor: pointer;
  width: 90px;
  text-align: center;
  float: right;
`;
const PopupCard = styled.div`
  width: 300px;
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: -150px;
  text-align: true;
  background-color: white;
  padding: 40px;
  transform: translateY(-50%);
`;
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  width: 100vw;
  height: 100vh;
  background-color: black;
  background-color: rgba(0, 0, 0, 0.75);
`;
const Title = styled.div`
  text-align: true;
  font-weight: bold;
`;

type Popup = {
  handleDeleteTrue: (event: React.MouseEvent<HTMLElement>) => void;
  handleDeleteFalse: (event: React.MouseEvent<HTMLElement>) => void;
};
export const Popup = ({ handleDeleteTrue, handleDeleteFalse }: Popup) => (
  <Overlay>
    <PopupCard>
      <Title>
        Are you sure you want to delete this track?<br></br> <br></br>
      </Title>
      <TrueButton onClick={handleDeleteTrue}>Yes</TrueButton>
      <FalseButton onClick={handleDeleteFalse}>No</FalseButton>
    </PopupCard>
  </Overlay>
);

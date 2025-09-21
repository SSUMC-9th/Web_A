import "./Header.css";

const Header = () => {
  return (
    <div className="Header">
      <h3>오늘의 날짜는 </h3>
      <h1> {new Date().toDateString()} 입니다.</h1>
    </div>
  );
};

export default Header;

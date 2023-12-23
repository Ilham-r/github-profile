import React, { useState, useEffect } from 'react';
import './App.css';
import chield from './assets/Chield_alt.svg';
import star from './assets/Star.svg';
import nesting from './assets/Nesting.svg';
import search from './assets/Search.svg';

function App() {
  const [user, setUser] = useState({});
  const [repos, setRepos] = useState([]);
  const [visibleRepos, setVisibleRepos] = useState(4);
  const [inputValue, setInputValue] = useState('');
  const today = new Date();
 
  
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (inputValue.trim() === '') {
          const response = await fetch(`https://api.github.com/users/github`);
        const data = await response.json();
        setUser(data);
        }else{

        const response = await fetch(`https://api.github.com/users/${inputValue}`);
        const data = await response.json();
        setUser(data);}
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchData();
  }, [inputValue]);

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        if (user.repos_url) {
          const response = await fetch(user.repos_url);
          const data = await response.json();
          setRepos(data);
        }
      } catch (error) {
        console.error('Error fetching repos:', error);
      }
    };

    fetchRepos();
  }, [user.repos_url]);

  const ShowAllRepos = () => {
    setVisibleRepos(repos.length);
  };

  const calculateDaysAgo = (updateDate) => {
    const updateDateTime = new Date(updateDate).getTime();
    const todayTime = today.getTime();
    const timeDifference = todayTime - updateDateTime;
    const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    return daysDifference;
  };

  return (
    <div className="App">
      <div className="input__container">
        <img className="icon" src={search} alt="Icon" />
        <input type="text"
          placeholder="username"
          value={inputValue}
          onChange={handleInputChange}/>
      </div>
      <div className="github__page">
        <div className="user__info">
          <img src={user.avatar_url} alt="profile" />
          <div className="wrapper">
          <div className="user__info-details">
            <p>Followers</p>
            <div className="vertical-line"></div>
            <p>{user.followers}</p>
          </div>
          <div className="user__info-details">
            <p>Following</p>
            <div className="vertical-line"></div>
            <p>{user.following}</p>
          </div>
          <div className="user__info-details">
            <p>Location</p>
            <div className="vertical-line"></div>
            <p>{user.location}</p>
            </div>
            </div>
          

        </div>
        <div className="github__page-desc">
          <p>{user.name}</p>
          <p>{user.bio}</p>
        </div>
        <div className="github__page-repo__wrapper">
        {repos.slice(0, visibleRepos).map(repo => (
              <div className="github__repo" key={repo.id}>
                <a href={repo.html_url} className="github__repo-title" target="_blank">
              {repo.name}</a>
                <p className="github__repo-desc">{repo.description}</p>
                <div className="github__repo-details">
                  {repo.license && (
                    <div className="detail">
                      <img src={chield} alt="chield" />
                      <p>MIT</p>
                    </div>
                  )}
                  <div className="detail">
                    <img src={nesting} alt="forked" />
                    <p>{repo.forks_count}</p>
                  </div>
                  <div className="detail">
                    <img src={star} alt="stars" />
                    <p>{repo.stargazers_count}</p>
                  </div>
                  <p className="updated">Updated {calculateDaysAgo(repo.updated_at)} days ago</p>
                </div>
              </div>
            ))}
        
        </div>
        {repos.length > visibleRepos && (
            <p className="viewall"onClick={ ShowAllRepos}>View all repositories</p>
          )}
      </div>
    </div>
  );
}

export default App;

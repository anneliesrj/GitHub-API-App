import React, { useState, useEffect } from 'react';
import '../styles/styles.css';

const UserSearch = () => {
  // State variables to manage user data, repository data, commits data, and loading state
  const [username, setUsername] = useState('');
  const [userData, setUserData] = useState(null);
  const [reposData, setReposData] = useState(null);
  const [commitsData, setCommitsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Function to handle user search
  const handleSearch = async () => {
    try {
      setIsLoading(true);

      // Fetch user data from the GitHub API via Express
      const userResponse = await fetch(`/user/${username}`);
      if (!userResponse.ok) {
        throw new Error('GitHub API request failed');
      }
      const userData = await userResponse.json();
      setUserData(userData);

      // Fetch user's repositories from the GitHub API via Express
      const reposResponse = await fetch(`/user/${username}/repos`);
      if (!reposResponse.ok) {
        throw new Error('GitHub API request failed');
      }
      const reposData = await reposResponse.json();
      setReposData(reposData);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  // Use effect to fetch commit data when repositories data is available
  useEffect(() => {
    if (reposData && reposData.length > 0) {
      const fetchCommits = async () => {
        try {
          // Fetch commit data for each repository
          const commits = await Promise.all(
            reposData.slice(0, 5).map(async (repo) => {
              const commitsResponse = await fetch(`${repo.url}/commits`);
              if (!commitsResponse.ok) {
                throw new Error('GitHub API request failed');
              }
              const commitsData = await commitsResponse.json();
              return { repoName: repo.name, commitsData };
            })
          );
          setCommitsData(commits);
        } catch (error) {
          console.error(error);
        }
      };

      fetchCommits();
    }
  }, [reposData]);

  return (
    <div className='user-info-container'>
      <header className="App-header">
        <img src="https://cdn.pixabay.com/photo/2022/01/30/13/33/github-6980894_1280.png" alt="GitHub logo"></img>
        <h1>Github User Search</h1>
      </header>
      {/* Search box */}
      <div className='search'>
        <input
          type="text"
          placeholder="Enter GitHub username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
  
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          // Display user details, repos and commits
          userData && (
            <div className="user-details-container">
              <div className="user-details-column">
              <div className="user-profile">
                {/* Link to user's GitHub profile */}
                <a href={userData.html_url} target="_blank" rel="noopener noreferrer">
                  <img src={userData.avatar_url} alt="User Avatar" />
                </a>
                <div>
                  {/* Link to user's GitHub profile */}
                  <h3>
                    <a href={userData.html_url} target="_blank" rel="noopener noreferrer">
                      {userData.name}
                    </a>
                  </h3>
                  <p>{userData.bio}</p>
                </div>
              </div>
                <div className="user-stats">
                  <p>Followers: {userData.followers}</p>
                  <p>Following: {userData.following}</p>
                  <p>Public Repositories: {userData.public_repos}</p>
                </div>
              </div>
  
              {reposData && reposData.length > 0 && (
                <div className="user-details-column">
                  <h2>Recent Repositories</h2>
                  <ul className="repos-list">
                    {reposData
                      .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
                      .slice(0, 5)
                      .map((repo) => (
                        <li key={repo.id}>
                          {/* Link to repos */}
                          <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                            {repo.name}
                          </a>
                          <p>Created: {new Date(repo.created_at).toDateString()}</p>
                          <p>Description: {repo.description}</p>
                          <p>Last Commit: {new Date(repo.updated_at).toDateString()}</p>
                        </li>
                      ))}
                  </ul>
                </div>
              )}
  
              {commitsData.length > 0 && (
                <div className="user-details-column">
                  <h2>Last 5 Commits</h2>
                  {commitsData.map((commit, index) => (
                    <div key={index}>
                      <h4>Repo: {commit.repoName}</h4>
                      <p>Message: {commit.commitsData[0].commit.message}</p>
                      <p>Author: {commit.commitsData[0].commit.author.name}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default UserSearch;

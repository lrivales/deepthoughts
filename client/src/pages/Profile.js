import Auth from '../utils/auth';
import React from 'react';
import FriendList from '../components/FriendList';
import { ADD_FRIEND } from '../utils/mutations';

import ThoughtList from '../components/ThoughtList';
import ThoughtForm from '../components/ThoughtForm';

import { useQuery, useMutation } from '@apollo/client';
import { QUERY_USER, QUERY_ME } from '../utils/queries';
import { Redirect } from 'react-router-dom';

const Profile = props => {
  const [addFriend] = useMutation(ADD_FRIEND);
  const username = props.match.params.username;

  const { loading, data } = useQuery(username ? QUERY_USER : QUERY_ME, {
    variables:{ username: username }
  });

  const user = data?.me || data?.user || {};
  if (Auth.loggedIn() && Auth.getProfile().data.username === username) {
    return <Redirect to={`/profile`} />;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user?.username) {
    return (
      <h4>
        You need to be logged in to see this page. Use the navigation links above to sign up or log in!
      </h4>
    )
  }

  const handleClick = async () => {
    try{
      await addFriend({
        variables: { id: user._id}
      });
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div>
      <div className="flex-row mb-3">
        <h2 className="bg-dark text-secondary p-3 display-inline-block">
          Viewing {username ? `${user.username}'s` : 'your'} profile.
        </h2>

        { username && (
          <button className='btn ml-auto' onClick={handleClick}>Add Friend</button>
        )}
      </div>
      <div className="flex-row justify-space-between mb-3">
        <div className="col-12 mb-3 col-lg-8">
          <ThoughtList thoughts={user.thoughts} title={`${user.username}'s thoughts...`} />
        </div>

        <div className="col-12 col-lg-3 mb-3">
          <FriendList 
            username={user.username}
            friendCount={user.friendCount}
            friends={user.friends}
          />
        </div>
      </div>
      <div className='mb-3'>{!username && <ThoughtForm />}</div>
    </div>
  );
};

export default Profile;

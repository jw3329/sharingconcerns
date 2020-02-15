import defaultProfile from './images/default-profile.png';
import React from 'react';
import { Link } from 'react-router-dom';

class Utils {

    static host = 'localhost';
    static port = 8000;
    static server = `http://${this.host}:${this.port}`;

    static toLocaleTimestamp(timestamp) {
        const now = new Date();
        const past = new Date(timestamp);
        const elapsed = now.getTime() - past.getTime();

        const msPerMinute = 60 * 1000;
        const msPerHour = msPerMinute * 60;
        const msPerDay = msPerHour * 24;
        const msPerMonth = msPerDay * 30;
        const msPerYear = msPerDay * 365;

        if (elapsed < msPerMinute) {
            return Math.round(elapsed / 1000) + ' seconds ago';
        } else if (elapsed < msPerHour) {
            return Math.round(elapsed / msPerMinute) + ' minutes ago';
        } else if (elapsed < msPerDay) {
            return Math.round(elapsed / msPerHour) + ' hours ago';
        } else if (elapsed < msPerMonth) {
            return Math.round(elapsed / msPerDay) + ' days ago';
        } else if (elapsed < msPerYear) {
            return Math.round(elapsed / msPerMonth) + ' months ago';
        } else {
            return Math.round(elapsed / msPerYear) + ' years ago';
        }
    }

    static getPostCards(posts) {

        const generatePostCard = (post, key) => (
            <div className="card m-3" key={key}>
                <div className="card-body">
                    <div className="row">
                        <div className="col-sm-3">
                            {Utils.getImageElement(post.user._id, post.user.profileImage)}
                        </div>
                        <div className="col-sm-6">
                            <Link to={`/post/${post._id}`}>{post.title}</Link>
                        </div>
                        <div className="col-sm-3" style={{ fontSize: "smaller" }}>
                            <div>{`${post.views} views`}</div>
                            <div>{post.user.username}</div>
                            <div>{Utils.toLocaleTimestamp(post.updateDate)}</div>
                            <div>{`${post.comments.length} comments`}</div>
                            <div className="d-flex justify-content-end">
                                <span className="badge badge-success m-2">{post.likes.length} likes</span>
                                <span className="badge badge-danger m-2">{post.dislikes.length} dislikes</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )

        return posts.map((post, key) => generatePostCard(post, key))
    }

    static getProfileImageLink(userId, profileImage) {
        return profileImage ? `${this.server}/api/user/${userId}/profileImage` : defaultProfile;
    }

    static getImageElement(userId, profileImage) {
        return <img className="w-100 rounded-circle" src={this.getProfileImageLink(userId, profileImage)} alt="" />
    }
}

export default Utils;
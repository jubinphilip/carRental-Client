// Reviews.tsx
import React, { useState, useEffect } from 'react';
import { GET_REVIEW } from '../../queries/user-queries';
import { useQuery } from '@apollo/client';
import client from '@/services/apollo-client';
import { FaStar } from "react-icons/fa6";
import Loader from '@/components/Preloader/PreLoader';
import styles from './review.module.css';

interface ReviewsProps {
    carid: string | string[];
}

interface Review {
    id: string;
    User?: {
        username: string;
        createdAt: string;
    };
    review: string;
}

const Reviews: React.FC<ReviewsProps> = ({ carid }) => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const { data: reviewdata, loading, error: reviewError } = useQuery(GET_REVIEW, {
        variables: { carId: carid },
        client
    });

    const rating = reviewdata?.getCarReviews?.averageRating ? Number(reviewdata.getCarReviews.averageRating) : 0;
    const count = reviews.length;

    useEffect(() => {
        if (reviewdata && reviewdata.getCarReviews && reviewdata.getCarReviews.reviews) {
            setReviews(reviewdata.getCarReviews.reviews);
        } else {
            setReviews([]); 
        }
    }, [reviewdata]);
    

    const validRating = Math.max(0, Math.min(rating, 5));
    const fullStars = Math.floor(validRating);
    const hasHalfStar = validRating % 1 !== 0;
    const totalStars = 5;

    if (reviewError) return <div className={styles.error}>Error loading reviews.</div>;
    if (loading) return <Loader />;

    return (
        <div className={styles.reviewsSection}>
            <div className={styles.reviewsCard}>
                <header className={styles.reviewsHeader}>
                    <h2 className={styles.title}>Ratings and Reviews</h2>
                    <div className={styles.ratingsSummary}>
                        <div className={styles.averageRating}>
                            <span className={styles.ratingNumber}>{validRating.toFixed(1)}</span>
                            <div className={styles.starsContainer}>
                                {[...Array(totalStars)].map((_, index) => (
                                    <FaStar
                                        key={index}
                                        className={`${styles.star} ${
                                            index < fullStars 
                                                ? styles.starFilled 
                                                : index === fullStars && hasHalfStar 
                                                    ? styles.starHalf 
                                                    : styles.starEmpty
                                        }`}
                                    />
                                ))}
                            </div>
                            <span className={styles.totalReviews}>Based on {count} reviews</span>
                        </div>
                    </div>
                </header>

                <div className={styles.reviewsList}>
                    {reviews.length > 0 ? (
                        reviews.map(review => {
                            const reviewDate = new Date(Number(review?.User?.createdAt));
                            const formattedDate = reviewDate.toLocaleDateString();

                            return (
                                <div key={review.id} className={styles.reviewCard}>
                                    <div className={styles.reviewHeader}>
                                        <div className={styles.userAvatar}>
                                            {review?.User?.username?.charAt(0) || 'A'}
                                        </div>
                                        <div className={styles.userInfo}>
                                            <h4 className={styles.username}>
                                                {review?.User?.username || 'Anonymous'}
                                            </h4>
                                            <span className={styles.reviewDate}>
                                                {isNaN(reviewDate.getTime()) ? 'Invalid date' : formattedDate}
                                            </span>
                                        </div>
                                    </div>
                                    <p className={styles.reviewText}>{review.review}</p>
                                </div>
                            );
                        })
                    ) : (
                        <div className={styles.noReviews}>No reviews available yet</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Reviews;
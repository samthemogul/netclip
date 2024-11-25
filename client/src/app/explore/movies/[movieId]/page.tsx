"use client"

// REACT/NEXT LIBS
import { useSearchParams, useParams } from 'next/navigation'
import { useEffect } from 'react';
import { useSelector } from 'react-redux';


// COMPONENTS
import DesktopNav from '@/components/DesktopNav';
import SearchBoxHeader from '@/components/SearchBoxHeader';

// MISC
import styles from "@/styles/pages/moviedetails.module.css"
import { RootState } from '@/redux/store';
import { IUser } from '@/types';

const MoviePage = () => {
    const user = useSelector((state: RootState) => state.user) as IUser;
    const params = useParams()

    useEffect(() => {
        console.log(params.movieId)
    }, [])
    
  return (
    <div>
        <SearchBoxHeader userDetails={user} />
        <DesktopNav />
        <div className={styles.movieDetailContainer}>
            <h1>Hi There</h1>
        </div>
    </div>
  )
}

export default MoviePage
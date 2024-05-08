"use client"
import React, { ChangeEvent, useState, useEffect } from 'react';
import Image from 'next/image';
import avatar from '../../components/assets/images/avatar/09.jpg'
import { axiosInstance } from '@/redux/interceptors';
import { SERVICE_URL } from '@/utils/endpoint';
import { useRouter } from 'next/navigation';
import { FaRegCheckCircle, FaFacebook, FaTwitter, FaInstagram,
	       FaLinkedin, FaYoutube, FaStar, FaPlay, FaUserGraduate,
				 FaStarHalfAlt, FaRegStar, FaRegThumbsUp, FaRegThumbsDown, 
				 FaBookOpen, FaClock, FaSignal, FaGlobe, FaMedal, FaUserClock} from "react-icons/fa";
import { AiOutlineMessage } from "react-icons/ai";
import Cookies from 'js-cookie';
import defaultImg from '../assets/images/avatar/defaultprofile.png';
import {Dialog, DialogContent} from '@material-ui/core';


interface Course {
	id:string;
	courseImage: string,
	courseTitle: string;
	lectures: number;
	price: number;
	courseLanguage: string;
	courseCategory: string;
	courseLevel: string;
	purchaseDate: string;
	shortDescrp: string;
	longDescrp: string;
	period: number;
	videoLink: string;
	curriculum: {
    curriculum: {
      lectureName: string;
      topics: {
        topicName: string;
        topicDescription: string;
        topicvideo: string;
      }[];
    }[];
	};
	user_id:{
		   name: string;
			 email: string;
			 profileImg: string;
			 abouttxt: string;
			 totalCourses:  number;
	};
	_id: string;
}

interface View {
	map(arg0: (item: any) => React.JSX.Element): unknown;
	id:string;
	courseId: {
		_id:string;
		courseImage: string,
		courseTitle: string;
		lectures: number;
		price: number;
		courseLanguage: string;
		courseCategory: string;
		courseLevel: string;
		purchaseDate: string;
		period: number;
	}
	userId: string;
	_id: string;
}



const CourseDetailsbody = () => {  
	const router = useRouter();
	const user = Cookies.get('token');
	const [course, setCourse] = useState<Course | null>(null);
	const [view, setView] = useState<View | null>(null);
	const [buttonPopup, setButtonPopup] = useState(false);
  const [reviewDetails , setReviewDetails] = useState({
		review: '',
		ratings: '',
		courseId: ''
	});



  useEffect(() => {
		const fetchData = async () => {
			try {
				const urlParams = new URLSearchParams(window.location.search);
				const courseId = urlParams.get('courseId');		
				if (courseId) {
					const courseResponse = await axiosInstance.get(`${SERVICE_URL}getsinglecourse/${courseId}`);
					const formattedCourse = {
						...courseResponse.data.data,
						purchaseDate: new Date(courseResponse.data.data.purchaseDate).toLocaleDateString()
					};
					setCourse(formattedCourse);	
				}
			} catch (error) {
				console.error('Error fetching data:', error);
			}
		};

		const fetchViewData = async () => {
			try {
					const viewResponse = await axiosInstance.get(`${SERVICE_URL}recentlyview`);
					console.log('View Response:', viewResponse.data.data);
					setView(viewResponse.data.data);  
			} catch (error) {
					console.error('Error fetching data:', error);
			}
	};

	
		fetchData();
		fetchViewData();
	}, []);
	
	const handleChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setReviewDetails({
      ...reviewDetails,
      [name]: value,
    });
  };

	const handleSubmit = async(e: { preventDefault: () => void; })=>{
		e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
		const courseId = urlParams.get('courseId');
   
		const response = await axiosInstance.post(`${SERVICE_URL}addtocart`, 
			{courseId},
			{
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json',
					Authorization: user 
				},
			}
		);
		console.log(response.data);
		const responseData = response.data;
		if(responseData.success){
			router.push('/cart');
		}
			
	}

  const postSubmit = async() =>{
		try {
			const urlParams = new URLSearchParams(window.location.search);
			const courseId = urlParams.get('courseId');

			let reviewData : any = new FormData();
			reviewData.append('review', reviewDetails.review);
			reviewData.append('ratings', reviewDetails.ratings);
      reviewData.append('courseId', courseId);

			axiosInstance.post(`${SERVICE_URL}postreview`, reviewData)
			.then((res)=>{
				console.log(res)
			})
			.catch((error)=>{
        console.log(error)
			})
			
		} catch (error) {
			console.error('Error creating review:', error);
		}		
	
	}

	const handleClose = () => {
		setButtonPopup(false); 
	};
return ();

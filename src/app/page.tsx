import React from 'react'
import Link from 'next/link'
import Hero from './user/components/Hero/Hero'
import Icons from './user/components/icons/icons'
import Popular from './user/components/popular/popular'
import Services from './user/components/Services/services'
import Whyus from './user/components/Whyus/Whyus'
import Contact from './user/components/Contact/Contact'

function Home() {
  return (
    <div>
     <Hero/>
     <Icons/>
     <Popular/>
     <Services/> 
     <Whyus/>
     <Contact/>
    </div>
  )
}

export default Home

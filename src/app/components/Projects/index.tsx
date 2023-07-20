'use client';

import { useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { motion, useAnimation, useInView } from 'framer-motion';
import ProjectCard from './ProjectCard';
import styled from 'styled-components';

const projects = [
    {
        title: 'Polititrack',
        description: 'Follow the 2016 presidential election.',
        thumbnail: '/polititrack.png',
        demo: '/polititrack.mov',
        link: 'https://polititrack.us',
    },
    {
        title: 'Simudraft',
        description: 'A generic mock draft simulator.',
        thumbnail: '/simudraft.png',
        demo: '/simudraft.mov',
        link: 'https://simudraft.netlify.app/',
    },
    {
        title: 'Perception Website',
        description: 'A homepage for a web management freelance client.',
        thumbnail: '/perception.png',
        demo: '/perception.mov',
        link: 'https://perception.net',
    },
    {
        title: 'Quick Trigger Kennels',
        description: 'A full business website for a freelance client.',
        thumbnail: '/qtk.png',
        demo: '/qtk.mov',
        link: 'https://quicktriggerkennels.com',
    },
];

const containerVariants = {
    visible: {
        transition: {
            staggerChildren: 0.3,
        },
    },
};

const variants = {
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            mass: 1.5,
            stiffness: 200,
        },
    },
    hidden: {
        opacity: 0,
        y: 100,
    },
};

const StyledViewMore = styled.a`
    color: ${({ theme }) => theme.colors.text3};

    &:hover {
        color: ${({ theme }) => theme.colors.main2};
    }
`;

const StyledProjects = styled.section`
    background-color: ${({ theme }) => theme.colors.background2};
    color: ${({ theme }) => theme.colors.text3};
`;

const StyledHeader = styled.h1`
    color: ${({ theme }) => theme.colors.text1};
`;

export default function Projects({}) {
    const sectionRef = useRef(null);
    const controls = useAnimation();
    const inView = useInView(sectionRef, { once: true, amount: 0.5 });

    useEffect(() => {
        if (inView) {
            controls.start('visible');
        }
    }, [controls, inView]);

    return (
        <StyledProjects className="text-center py-16 sm:py-20 md:py-32" ref={sectionRef}>
            <StyledHeader className="text-5xl">Some stuff I&apos;ve built</StyledHeader>
            <motion.ul
                className="pt-12 grid max-w-[26rem] sm:max-w-[52.5rem] grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mx-auto gap-6 lg:gap-y-8 xl:gap-x-8 lg:max-w-7xl px-4 sm:px-6 lg:px-8"
                variants={containerVariants}
                initial="hidden"
                animate={controls}
            >
                {projects.map((project, index) => (
                    <motion.div key={index} variants={variants}>
                        <ProjectCard
                            key={index}
                            title={project.title}
                            description={project.description}
                            thumbnail={project.thumbnail}
                            demo={project.demo}
                            link={project.link}
                        />
                    </motion.div>
                ))}
            </motion.ul>
            <div className="pt-12">
                <StyledViewMore href="https://github.com/schimizzimj" target="_blank" className="group">
                    <h2 className="text-xl md:text-3xl font-sans font-semibold">
                        View More <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                    </h2>
                </StyledViewMore>
            </div>
        </StyledProjects>
    );
}

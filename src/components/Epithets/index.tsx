import { setRandomInterval } from '@/utils/utils';
import { capitalize } from '@/utils/utils';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import styled, { useTheme } from 'styled-components';

const MIN_INTERVAL = 3000;
const MAX_INTERVAL = 10000;

const GradientSpan = styled.span<{ $color1: string; $color2: string; $color3: string }>`
    background-clip: text;
    background-image: ${(props) =>
        `linear-gradient(160deg, ${props.$color1} 0, ${props.$color2} 50%, ${props.$color3} 100%)`};
    display: inline-block;
    position: relative;
    -webkit-text-fill-color: transparent;
    -webkit-background-clip: text;
    z-index: 2;
`;

const StyledEpithetWrapper = styled.div`
    display: block;
    position: relative;
    height: 3rem;
    overflow: hidden;
    align-items: center;
    width: 100%;
    transition: height 0.7s ease-in-out;
`;

interface SingleEpithet {
    /** The text content of the epithet. */
    text: string;

    /** The category of epithet. */
    category: string;

    /** An optional emoji or decoration to include with the epithet. */
    emoji?: ReactNode;
}

interface EpithetsProps {
    /** Array of possible epithets to show. */
    epithets: SingleEpithet[];
}

interface EpithetProps {
    epithets: SingleEpithet[];
    formatter: (epithet: SingleEpithet) => ReactNode;
}

function Epithet({ epithets, formatter }: EpithetProps) {
    const { colors } = useTheme();
    const [index, setIndex] = useState(0);
    const [height, setHeight] = useState(0);

    function getTrueIndex(index: number) {
        if (index < 0) {
            return epithets.length - 1;
        }
        if (index >= epithets.length) {
            return 0;
        }
        return index;
    }

    function getEpithetClass(i: number) {
        let baseClass = 'epithet-item text-2xl md:text-3xl lg:text-5xl font-bold';
        if (i === index) {
            baseClass += ' epithet-item-current';
        } else if (i === getTrueIndex(index - 1)) {
            baseClass += ' epithet-item-previous';
        } else if (i === getTrueIndex(index + 1)) {
            baseClass += ' epithet-item-next';
        }
        return baseClass;
    }

    useEffect(() => {
        function updateHeight() {
            const height = document.getElementById(`epithet-${index}-${epithets[index].text}`)?.clientHeight;
            if (height) {
                setHeight(height);
            }
        }

        updateHeight();

        const interval = setRandomInterval(
            () => {
                setIndex((prevIndex) => (prevIndex + 1) % epithets.length);
                updateHeight();
            },
            MIN_INTERVAL,
            MAX_INTERVAL,
        );

        return () => interval.clear();
    }, [epithets, epithets.length, index]);

    return (
        <StyledEpithetWrapper
            style={{
                height: `${height}px`,
            }}
        >
            {epithets.map((epithet, i) => {
                if (i === index || i === getTrueIndex(index - 1) || i === getTrueIndex(index + 1)) {
                    return (
                        <div key={`epithet-${i}`} className={getEpithetClass(i)} id={`epithet-${i}-${epithet.text}`}>
                            <GradientSpan $color1={colors.main1} $color2={colors.main2} $color3={colors.main3}>
                                {formatter(epithet)}
                            </GradientSpan>
                        </div>
                    );
                }
                return null;
            })}
        </StyledEpithetWrapper>
    );
}

interface SortedEpithets {
    [key: string]: SingleEpithet[];
}

function sortEpithets(unsortedEpithets: SingleEpithet[]) {
    const sorted: SortedEpithets = {};
    unsortedEpithets.forEach((epithet) => {
        if (epithet.category in sorted) {
            sorted[epithet.category].push(epithet);
        } else {
            sorted[epithet.category] = [epithet];
        }
    });
    return sorted;
}

export default function Epithets({ epithets }: EpithetsProps) {
    const sortedEpithets: SortedEpithets = useMemo(() => sortEpithets(epithets), [epithets]);

    function epithetFormatter(index: number) {
        if (index === 0) {
            return (epithet: SingleEpithet) => `${capitalize(epithet.text)},`;
        }
        if (index === Object.keys(sortedEpithets).length - 1) {
            return (epithet: SingleEpithet) => `and ${epithet.text}.`;
        }
        return (epithet: SingleEpithet) => `${epithet.text},`;
    }

    return (
        <div className="my-3">
            {Object.keys(sortedEpithets).map((key, index) => {
                return <Epithet epithets={sortedEpithets[key]} key={key} formatter={epithetFormatter(index)} />;
            })}
        </div>
    );
}

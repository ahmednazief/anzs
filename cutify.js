document.addEventListener('DOMContentLoaded', () => {
    // Cutify specific animations

    const timelineShowcase = document.querySelector('.timeline-showcase');
    if (!timelineShowcase) return;

    const playhead = document.getElementById('playhead');
    const statusOverlay = document.getElementById('statusOverlay');
    const vTrack = document.getElementById('vTrack');
    const aTrack = document.getElementById('aTrack');

    // Define the clip sequence: 0 = good, 1 = silent
    // Based on HTML structure: good (20%), silent (15%), good (30%), silent (10%), good (25%)
    
    // We will do a full CSS-JS animation loop
    function runAnimation() {
        // Reset everything
        const vClips = Array.from(vTrack.children);
        const aClips = Array.from(aTrack.children);
        
        vClips[0].style.width = '20%'; vClips[0].className = 'clip clip-good';
        vClips[1].style.width = '15%'; vClips[1].className = 'clip clip-silent';
        vClips[2].style.width = '30%'; vClips[2].className = 'clip clip-good';
        vClips[3].style.width = '10%'; vClips[3].className = 'clip clip-silent';
        vClips[4].style.width = '25%'; vClips[4].className = 'clip clip-good';

        aClips[0].style.width = '20%'; aClips[0].className = 'clip clip-good';
        aClips[1].style.width = '15%'; aClips[1].className = 'clip clip-silent';
        aClips[2].style.width = '30%'; aClips[2].className = 'clip clip-good';
        aClips[3].style.width = '10%'; aClips[3].className = 'clip clip-silent';
        aClips[4].style.width = '25%'; aClips[4].className = 'clip clip-good';

        playhead.style.left = '0%';
        playhead.style.transition = 'none';
        
        // Force reflow
        void playhead.offsetWidth;
        
        // Sequence phases
        statusOverlay.innerText = "SCANNING...";
        statusOverlay.style.color = "#ccc";
        statusOverlay.style.borderColor = "rgba(255,255,255,0.2)";

        // Phase 1: Playhead moves over first clip (20%)
        playhead.style.transition = 'left 1.5s linear';
        playhead.style.left = '20%';

        setTimeout(() => {
            // Arrived at first silent clip
            statusOverlay.innerText = "SILENCE DETECTED";
            statusOverlay.style.color = "#ff3333";
            statusOverlay.style.borderColor = "#ff3333";
            
            vClips[1].classList.add('cutting');
            aClips[1].classList.add('cutting');

            setTimeout(() => {
                // Delete the clip
                statusOverlay.innerText = "RIPPLE DELETE";
                statusOverlay.style.color = "#C542FF";
                statusOverlay.style.borderColor = "#C542FF";
                
                vClips[1].classList.remove('cutting');
                aClips[1].classList.remove('cutting');
                vClips[1].classList.add('removed');
                aClips[1].classList.add('removed');

                // Move playhead virtually to 20% again since clips shifted, but width is now out of 85%
                // Wait for snap
                setTimeout(() => {
                    statusOverlay.innerText = "SCANNING...";
                    statusOverlay.style.color = "#ccc";
                    statusOverlay.style.borderColor = "rgba(255,255,255,0.2)";
                    
                    // Phase 2: move over next good clip (30% relative to original, but now part of remaining)
                    // The timeline container flex will resize remaining % smoothly.
                    // We just need to move playhead forward relative to parent
                    playhead.style.transition = 'left 2s linear';
                    playhead.style.left = '55.5%'; // 20/(100-15) -> 23.5% + 30/85 -> 35.2%. Let's just approximate

                    setTimeout(() => {
                        // Arrived at second silent clip
                        statusOverlay.innerText = "SILENCE DETECTED";
                        statusOverlay.style.color = "#ff3333";
                        statusOverlay.style.borderColor = "#ff3333";
                        
                        vClips[3].classList.add('cutting');
                        aClips[3].classList.add('cutting');

                        setTimeout(() => {
                            statusOverlay.innerText = "RIPPLE DELETE";
                            statusOverlay.style.color = "#C542FF";
                            statusOverlay.style.borderColor = "#C542FF";
                            
                            vClips[3].classList.remove('cutting');
                            aClips[3].classList.remove('cutting');
                            vClips[3].classList.add('removed');
                            aClips[3].classList.add('removed');

                            setTimeout(() => {
                                statusOverlay.innerText = "FINISHING...";
                                statusOverlay.style.color = "#ccc";
                                statusOverlay.style.borderColor = "rgba(255,255,255,0.2)";
                                
                                playhead.style.transition = 'left 1.5s linear';
                                playhead.style.left = '100%';

                                setTimeout(() => {
                                    statusOverlay.innerText = "CLEAN SEQUENCE READY";
                                    statusOverlay.style.color = "#2D6B3E";
                                    statusOverlay.style.borderColor = "#2D6B3E";

                                    // Restart loop
                                    setTimeout(runAnimation, 3000);

                                }, 1500);

                            }, 800);

                        }, 500);
                    }, 2000);

                }, 500);
                
            }, 600);

        }, 1500);
    }

    // Start loop
    setTimeout(runAnimation, 1000);

    // Magnetic Download Button
    const downloadBtn = document.getElementById('downloadBtn');
    if(downloadBtn) {
        downloadBtn.addEventListener('mousemove', (e) => {
            const rect = downloadBtn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            downloadBtn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px) scale(1.05)`;
        });
        downloadBtn.addEventListener('mouseleave', () => {
            downloadBtn.style.transform = `translate(0px, 0px) scale(1)`;
        });
    }
});

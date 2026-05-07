import FingerprintJS from '@fingerprintjs/fingerprintjs';

export interface FingerprintData {
  visitorId: string;
  userAgent: string;
  screenResolution: string;
  browserTimezone: string;
  browserLanguage: string;
  cpuCores: number;
  deviceMemory: number;
  webrtcIp: string;
  canvasFingerprint: string;
}

let fpPromise: Promise<any> | null = null;

export async function getFingerprint(): Promise<FingerprintData> {
  if (!fpPromise) {
    fpPromise = FingerprintJS.load();
  }

  const fp = await fpPromise;
  const result = await fp.get();
  
  const fingerprintData: FingerprintData = {
    visitorId: result.visitorId,
    userAgent: navigator.userAgent,
    screenResolution: `${window.screen.width}x${window.screen.height}`,
    browserTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    browserLanguage: navigator.language,
    cpuCores: navigator.hardwareConcurrency || 0,
    deviceMemory: (navigator as any).deviceMemory || 0,
    webrtcIp: await getWebRTCIP(),
    canvasFingerprint: generateCanvasFingerprint(),
  };

  sessionStorage.setItem('fingerprintData', JSON.stringify(fingerprintData));
  return fingerprintData;
}

export function getStoredFingerprint(): FingerprintData | null {
  const stored = sessionStorage.getItem('fingerprintData');
  return stored ? JSON.parse(stored) : null;
}

async function getWebRTCIP(): Promise<string> {
  return new Promise((resolve) => {
    const ips: string[] = [];
    const pc = new RTCPeerConnection({
      iceServers: [],
    });

    pc.createDataChannel('');
    
    pc.createOffer()
      .then((offer) => pc.setLocalDescription(offer))
      .catch((err) => {
        console.error('WebRTC error:', err);
        resolve('');
      });

    pc.onicecandidate = (ice) => {
      if (!ice || !ice.candidate || !ice.candidate.candidate) {
        pc.close();
        resolve(ips[0] || '');
        return;
      }

      const candidate = ice.candidate.candidate;
      const ipMatch = candidate.match(/(\d{1,3}\.){3}\d{1,3}/);
      const ipv6Match = candidate.match(/([a-f0-9:]+:+)+[a-f0-9]+/i);

      if (ipMatch && !ips.includes(ipMatch[0])) {
        ips.push(ipMatch[0]);
      }
      if (ipv6Match && !ips.includes(ipv6Match[0])) {
        ips.push(ipv6Match[0]);
      }
    };

    setTimeout(() => {
      pc.close();
      resolve(ips[0] || '');
    }, 3000);
  });
}

function generateCanvasFingerprint(): string {
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    canvas.width = 200;
    canvas.height = 50;

    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillStyle = '#f60';
    ctx.fillRect(125, 1, 62, 20);
    ctx.fillStyle = '#069';
    ctx.fillText('SDF Ltd Fingerprint 🌟', 2, 15);
    ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
    ctx.fillText('Canvas Test', 4, 45);

    const dataUrl = canvas.toDataURL();
    let hash = 0;
    for (let i = 0; i < dataUrl.length; i++) {
      const char = dataUrl.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }

    return Math.abs(hash).toString(16);
  } catch (error) {
    return '';
  }
}

export async function collectFingerprintOnLoad(): Promise<void> {
  try {
    await getFingerprint();
  } catch (error) {
    console.error('Fingerprint collection failed:', error);
  }
}

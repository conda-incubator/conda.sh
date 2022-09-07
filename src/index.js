/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npx wrangler dev src/index.js` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npx wrangler publish src/index.js --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

//export default {
//	async fetch(request) {
//		return new Response("Hello World!");
//	},
//};



const BLOCKED_HOSTNAMES = ['nope.mywebsite.com', 'bye.website.com'];

async function handleRequest(request) {
  // Return a new Response based on a URL's hostname
  const url = new URL(request.url);

  //if (BLOCKED_HOSTNAMES.includes(url.hostname)) {
  //  return new Response('Blocked Host', { status: 403 });
  //}

  //// Block paths ending in .doc or .xml based on the URL's file extension
  //const forbiddenExtRegExp = new RegExp(/\.(doc|xml)$/);

  //if (forbiddenExtRegExp.test(url.pathname)) {
  //  return new Response('Blocked Extension', { status: 403 });
  //}

  //// On HTTP method
  //if (request.method === 'POST') {
  //  return new Response('Response for POST');
  //}

  // On User Agent
  const userAgent = request.headers.get('User-Agent') || '';
  if (userAgent.includes('curl')) {
    return new Response(`#!/bin/bash
# <!--

echo ""
echo "  ██████╗ ██████╗ ███╗   ██╗██████╗  █████╗    ███████╗██╗  ██╗"
echo " ██╔════╝██╔═══██╗████╗  ██║██╔══██╗██╔══██╗   ██╔════╝██║  ██║"
echo " ██║     ██║   ██║██╔██╗ ██║██║  ██║███████║   ███████╗███████║"
echo " ██║     ██║   ██║██║╚██╗██║██║  ██║██╔══██║   ╚════██║██╔══██║"
echo " ╚██████╗╚██████╔╝██║ ╚████║██████╔╝██║  ██║██╗███████║██║  ██║"
echo "  ╚═════╝ ╚═════╝ ╚═╝  ╚═══╝╚═════╝ ╚═╝  ╚═╝╚═╝╚══════╝╚═╝  ╚═╝"
echo " Conda is a trademark of Anaconda, Inc. This is not an official"
echo " Anaconda product, and is just provided for convenience."

_uname=$(command uname)
if [[ $_uname == "Darwin" ]]
then
    PLAT="MacOSX"
    ARCH=$(command arch)
    if [[ $ARCH == "i386" ]]
    then
      ARCH="x86_64"
    fi
else
    PLAT="Linux"
    ARCH=$(command arch)
    if [[ $ARCH == "i386" ]]
    then
      ARCH="x86_64"
    fi
fi

TARGET="https://repo.anaconda.com/miniconda/Miniconda3-latest-$PLAT-$ARCH.sh"
TMP=$(mktemp -u).sh

echo "Will download $TARGET – and execute it."
echo "$ sh <(curl $TARGET)"
# echo "Press \x1b[1;32mAny key to continue\x1b[1;0m, \x1b[1;31mCtrl-C\x1b[1;0m to abort"
echo "Press Any key to continue, Ctrl-C to abort"
read
curl -o $TMP $TARGET
sh $TMP`, { status: 200 });
  }

  // On Client's IP address
  // const clientIP = request.headers.get('CF-Connecting-IP');
  // if (clientIP === '1.2.3.4') {
  //   return new Response('Block the IP 1.2.3.4', { status: 403 });
  // }

  // // On ASN
  // if (request.cf && request.cf.asn == 64512) {
  //   return new Response('Block the ASN 64512 response');
  // }

  // // On Device Type
  // // Requires Enterprise "CF-Device-Type Header" zone setting or
  // // Page Rule with "Cache By Device Type" setting applied.
  // const device = request.headers.get('CF-Device-Type');
  // if (device === 'mobile') {
  //   return Response.redirect('https://mobile.example.com');
  

  // }
  return new Response(`
  <html>
    <header>
    <style>
    body {
      background-color: #444;
    }
    pre:before{
     content:'$'
    }
    pre {
        font-size: 200%;
        margin: 10%;
        background: #ccc;
        padding: 20px;
        text-align: left;
    }
    </style>
    </header>
    <body>
      <pre> bash <(curl -L conda.sh)</pre>
      <p>
         When detectign curl, we serve a tiny sh script that tries to detect your pltform
         and architecture and try to download and isntall the corresponding miniconda
         install then run it.</p>
      <p>Not affiliated with Anaconda, Inc. Use at your own risk.</p>
    </body>
  </html>`, { status: 200 , headers: {
      'content-type': 'text/html;charset=UTF-8',
    }});
  


  console.error(
    "Getting Client's IP address, device type, and ASN are not supported in playground. Must test on a live worker"
  );
  return fetch(request);
}

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

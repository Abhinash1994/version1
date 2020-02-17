/*1488005939,,JIT Construction: v2856569,en_US*/

/**
 * Copyright Facebook Inc.
 *
 * Licensed under the Apache License, Version 2.0
 * http://www.apache.org/licenses/LICENSE-2.0
 */
(function _(a,b){var c=24*60*60,d=7*c,e='https://developers.facebook.com/docs/accountkit/'+'integratingweb#configureloginhtml',f='Please ensure the AccountKit SDK is hotlinked directly. See '+e,g=Math.floor(new Date().getTime()/1000)-b;if(g>d){throw new Error('The SDK is more than 7 days old. '+f);}else if(g>c){var h=window.console;if(h)h.warn('The SDK is more than 1 day old. '+f);}if(!window.AccountKit)window.AccountKit={doNotLinkToSDKDirectly:'doNotLinkToSDKDirectly'};var i=document.createElement('script');i.src=a;i.async=true;var j=document.getElementsByTagName('script')[0];j.parentNode&&j.parentNode.insertBefore(i,j);})("https:\/\/sdk.accountkit.com\/en_US\/sdk.js?hash=90d285cfc098f292b1c4bd53ba22490f", 1488005939);
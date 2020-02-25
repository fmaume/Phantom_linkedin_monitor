// Phantombuster configuration {
"phantombuster command: nodejs"
"phantombuster package: 5"
"phantombuster dependencies: lib-StoreUtilities.js, lib-LinkedIn.js, lib-Messaging.js"

const Buster = require("phantombuster")
const buster = new Buster()

const Nick = require("nickjs")
const nick = new Nick({
	loadImages: true,
	userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.12; rv:54.0) Gecko/20100101 Firefox/54.0",
	printPageErrors: false,
	printResourceErrors: false,
	printNavigation: false,
	printAborts: false,
})

const StoreUtilities = require("./lib-StoreUtilities")
const utils = new StoreUtilities(nick, buster)
const LinkedIn = require("./lib-LinkedIn")
const linkedIn = new LinkedIn(nick, buster, utils)

/* global jQuery  */

// }


const get_n_notification = (arg, done) => {

    //seclect notification panel  
  stemp = document.querySelector("#notifications-nav-item")
    //get number of unread notification or return zero notification
  try {
  stemp = stemp.querySelector(".visually-hidden")
  stemp = stemp.textContent
  } catch(err) {
      stemp = "Zero notification"
  }  
  done(null, stemp)
  
  
}

const get_n_message = (arg, done) => {

    //seclect notification panel  
  stemp = document.querySelector("#messaging-nav-item")
    //get number of unread notification or return zero notification
  try {
  stemp = stemp.querySelector(".visually-hidden")
  stemp = stemp.textContent
  } catch(err) {
      stemp = "Zero messages"
  }  
  done(null, stemp)
  
  
}

const get_n_network_not = (arg, done) => {

    //seclect notification panel  
  stemp = document.querySelector("#mynetwork-nav-item")
    //get number of unread notification or return zero notification
  try {
  stemp = stemp.querySelector(".visually-hidden")
  stemp = stemp.textContent
  } catch(err) {
      stemp = "Zero network notification"
  }  
  done(null, stemp)
  
  
}


async function main(){
const arg = buster.argument

tab = await nick.newTab()
try {
await linkedIn.login(tab, arg.sessionCookie, "https://www.linkedin.com/")


    //check that notification panel is visible
    
    const pageTimeout = 5000
    
    //tech screenshot for testing purpose
    const path = await tab.screenshot("image.jpg")
    const url = await buster.save(path , "image.jpg")
    console.log("Screenshot saved at", path)

    try {
        selectors = "#notifications-nav-item"
        await tab.waitUntilVisible(selectors, pageTimeout)
        const notification_count = await tab.evaluate(get_n_notification, arg)
        
        selectors = "#messaging-nav-item"
        await tab.waitUntilVisible(selectors, pageTimeout)
        const message_count = await tab.evaluate(get_n_message , arg)
        
        selectors = "#mynetwork-nav-item"
        await tab.waitUntilVisible(selectors, pageTimeout)
        const network_count = await tab.evaluate(get_n_network_not, arg)
        
        const subject = "Linkedin status : " + arg.accountName
        const text = notification_count + ", " + message_count +", " + network_count
        const to = arg.notificationEmail
        await buster.mail(subject, text, to)
        
        nick.exit()

    } catch(err) {
    console.log("Oh no! Even after 5s, the element was still not visible:", err)
    nick.exit()
    }

} catch(err) {
    //cockie is no more valide    
   console.log("Oh no! Even after 5s, the element was still not visible:", err) 
   
   //send email notification that the cokie is no more valide
    const subject = "Linkedin cookie error: " + arg.accountName
    const text = err +" for the following account" + arg.accountName
    const to = arg.notificationEmail
   
   nick.exit()
}

}

main()

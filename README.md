# DBM Dashboard

> Manage your DBM bot fron any place.


| DBM Dashboard Features                                                | Description                         |                                                      |                                    
| -------------------------------------------------------------- | ----------------------------------- | ---------------------------------------------------- |
| Admin Panel                                   | Manage your bot from the admin panel.| [Example](https://sharex.greatplainsmodding.com/x0X8) 
| Cusotm Mods             | Anyone that knows JavaScript can create mods for the dashboard.)| [Example]() 
| Dashboard | People can login to the dashboard and invite your bot.| [Example](https://sharex.greatplainsmodding.com/XyUo)
| Landing Page   | You need a website to show off your awsome bot!| [Example](https://sharex.greatplainsmodding.com/llvs) 

## Links
> [Developer Portal](https://discordapp.com/developers)<br>
> [DBM Network](https://discord.gg/3QxkZPK)

## Step 1
> Download the needed files. You can download them through CMD if you have git installed. After you have downloaded the files, unzip them and paste them into your bots extensions folder. <br> <code>git clone https://github.com/greatplainsmodding/DBM-Dashboard.git</code>

## Step 2 
> Open DBM and navigate to <code>Extensions < DBM Dashboard</code> Place your ID in the field where it says <b>Owner ID</b>.
>
> Next you will need to navigate to the [Developer Portal](https://discordapp.com/developers). Click on <b>General Information</b> and copy your client secrent. After you copy that go back to DBM and paste it where it says <b>clientSecret</b>. Navigate back to the [Developer Portal](https://discordapp.com/developers) and click on <b>OAuth2</b>. Click where it says <b>Add Redirect</b> and paste this URL <code>http://localhost:3000/dashboard/callback</code>

## Step 3
> Go to your bots main folder then go to <code>/extensions/dbm_dashboard_extension</code> and do <code>npm i</code> and then start your bot!

## Step 4
> Now to configure the dashboard! Navigate to <code>http://localhost:3000/dashboard/admin</code> and here you can change the text for the landing page located here <code>http://localhost:3000/</code>

## Bugs
> After you make a change through the extension in DBM and reopen it, it wont update.

## Other Info
> <b>Creating Mods:</b> Just like DBM you can create mods for DBM Dashboard! Its just like DBM.<br>
> <b>Dashboard:</b> The dashboard part will be coming soon, for now you are stuck with the admin panel! The dashboard will be just like the admin panel. People can create mods for it and do whatever!<br>
> <b>Report Bugs:</b> Please dont ping me or dm me! You can report bugs [here](https://github.com/greatplainsmodding/DBM-Dashboard/issues).

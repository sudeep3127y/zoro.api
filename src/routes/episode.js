const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const episode = express();
const cors = require('cors');

const USER_AGENT ="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36";
const ACCEPT_ENCODING_HEADER = "gzip, deflate, br";

episode.use(cors());

episode.get('/episode/:id', async ( req, res)=>{
    const episodeanime = req.params.id.match(/\d+/);
    const episodelink = `https://aniwatchtv.to/ajax/v2/episode/list/${episodeanime}`;

    try {
        const episodewanna = await axios.get(episodelink, {
            headers:{
                'User-Agent': USER_AGENT,
                "Accept-Encoding": ACCEPT_ENCODING_HEADER,
            }
        });
        const episodey = episodewanna?.data?.html;
    
        const $ = cheerio.load(episodey);
    
        const episodetown = [];
    
        $('.ss-list .ssl-item.ep-item').each(function(index, element) {
            const name = $(element).find('.e-dynamic-name').text().trim();
            const order = $(element).find('.ssli-order').text().trim();
            const epId = $(element).attr('href').split('/watch/')[1];
        
            episodetown.push({
                order,
                name,
                epId,
            });
        });
        
    
        res.json({episodetown});
    
    } catch (error) {
        console.log('new error bhai', error);
    }
})

module.exports = episode;

import React, { Component } from "react";
import { url, mxtEnd, tagEnd } from "../constants";
import AuthHandle from "./AuthHandler.js";
import TalkItem from "./Talks.js";
import TalkCard from "./TalkCard.js";
import AddTag from "./AddTag.js";
import TagBin from "./TagBin.js";
import { Box, Paper, List, ListItem, ListItemText, FormControl, TextField, Button, Typography } from '@material-ui/core';
import { spacing } from '@material-ui/system';
import LabelIcon from '@material-ui/icons/Label';

class Tags extends Component {
    constructor(props){
        super(props);
        this.adder = this.adder.bind(this)
        this.deleteLabel = this.deleteLabel.bind(this)
    }
    state = {
            tags: [],
            cache: [],
            token: {}, 
            tagBins: {}
          }

    async getTags() {

        //get the user's tags
        await fetch(url + tagEnd, {
            method: 'GET',
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + this.token
            }}
            ).then((response) => response.json())
            .then((data) => {
                console.log("succes");
            this.setState({ tags : data["tags"]});
            }
            );
        }

    async getCache(){

        //get the user's mxt cache
        await fetch(url + mxtEnd, {
            method: 'GET',
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + this.token
            }}
            ).then((response) => response.json())
            .then((data) => {
            this.setState({ cache : data});
            }

            );
    }

    async makeBins(){
        
        var tagBins = {}; //JSON object to hold all of the tag bins with labels as the keys to an array of most recent cache talks with that tag
        if (this.state.tags != null){
            for (var i = 0; i < this.state.tags.length; i++){
                var bin = [];
                for (var j = 0; j < this.state.cache.length; j++){
                    if (this.state.cache[j].talk.includes(this.state.tags[i])){
                        bin.push(this.state.cache[j]);
                    }
                }
                tagBins[this.state.tags[i]] = bin;
            }

            this.setState({tagBins : tagBins});
        }
    }

    async componentWillMount() {
        this.token = await AuthHandle.getToken();
        await this.getTags();
        await this.getCache();
        await this.makeBins();
        console.log(this.state.tags);
        console.log(this.state.cache);
        console.log(this.state.tagBins);
    }

    async adder(toAdd) {
        this.setState({ token : await AuthHandle.getToken()});

        await fetch(url + tagEnd, {
            method: 'POST',
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + this.state.token
            },
            body: JSON.stringify({ "tag" : toAdd})
            }).then((response) => response.json())
            .then((data) => {
        })
        
        //refresh the tags, cache, bin with new tag
        await this.getTags();
        await this.getCache();
        await this.makeBins();
        }

    async deleteLabel(label) {
        this.setState({ token : await AuthHandle.getToken()});

        await fetch(url + tagEnd, {
            method: 'POST',
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + this.state.token
            },
            body: JSON.stringify({ "tag" : label, "remove" : 1})
            }).then((response) => response.json())
            .then((data) => {
        })
        
        //refresh the tags, cache, bin with tag now removed
        await this.getTags();
        await this.getCache();
        await this.makeBins();
        }

    render() {
        return (
            <Box m={2} mb={10}>
            <div>
        <Typography variant="h6">
              Memory Bins
        </Typography>
            <List>
                {this.state.tags != null && this.state.tags.map((tag, i) => (
                    <div>

                    <TagBin deleter={this.deleteLabel} title={tag} talks={this.state.tagBins[tag]}/>
                    </div>
                        ))
                    }
                            </List>
            <AddTag adder={this.adder}/>
                </div>
            </Box>
          )
      }
}

export default Tags
import * as React from 'react';
import {useMemo, useState} from 'react';
import Button from '@mui/material/Button';
import ClearIcon from '@mui/icons-material/Clear';
import AddIcon from '@mui/icons-material/Add';
import {PrimaryButton2} from "../CustomMUIComponents/CustomButtons"
import axios from "axios";
import {StudyRoomCard} from "./CommonResources";
import {GetAuthentication} from "../Authentication/Authentification";


export default function ParticipantsList() {
    const studyRoomID = window.location.href.split("/")[window.location.href.split("/").length - 1];

    const [participants, setParticipants] = useState([])

    const [errorMessage, setErrorMessage] = useState('')

    const [availableFriends, setAvailableFriends] = useState([])

    const [owner, setOwner] = useState('');

    function handleDelete(index) {
        const emailToRemove = participants[index];
        axios.post(`${process.env.REACT_APP_BASE_URL}room/remove`, {email: emailToRemove, studyRoomID: studyRoomID})
            .then(getParticipants)
            .catch(err => {
                handleErrorMessage(err)
            });
    }

    function handleAdd(index) {
        const emailToAdd = availableFriends[index];
        axios.post(`${process.env.REACT_APP_BASE_URL}room/add`, {email: emailToAdd, studyRoomID: studyRoomID})
            .then(getParticipants)
            .catch(err => {
                handleErrorMessage(err)
            });
    }
    function handleErrorMessage(err){
        setErrorMessage(`${err}`.substring(44) === (401).toString() ? 'request could not be sent' : `${err}`)
    }

    function handleDone() {
        document.elementFromPoint(0, 0).click();
    }

    function getParticipants() {
        axios.get(`${process.env.REACT_APP_BASE_URL}room/fetch/${studyRoomID}`)
            .then(res => {
                const newParticipants = fetchNewParticipants(res.data)
                // obtain friend list, remove current participants from friend list, then set current participants and available friends to add
                const email = GetAuthentication().email
                axios.get(`${process.env.REACT_APP_BASE_URL}student/email/${email}`)
                    .then(res => {
                        filterParticipantsForAvailableFriends(newParticipants, res.data.friends)
                    })
                    .catch(err => {
                        handleErrorMessage(err)
                    });
            })
            .catch(err => {
                handleErrorMessage(err)
            });
    }
    function fetchNewParticipants(data){
        const newOwner = data.owner;
        setOwner(newOwner);
        return [owner !== '' ? owner.toString() : [], data.participants ? data.participants.filter((participant) => participant !== owner.toString()) : []].flat()
    }

    function filterParticipantsForAvailableFriends(newParticipants, data){
        let newAvailableFriends = (newParticipants ? data.filter((email) => !newParticipants.includes(email)) : data);
        setParticipants(newParticipants);
        setAvailableFriends(newAvailableFriends);
    }

    useMemo(getParticipants, [])

    const participantsList = (
        <>
            <div style={{width: '90vw'}}>
                <div><h4>Current Participants:</h4></div>
                <div style={{overflow: "auto", maxHeight: "26vh"}}>
                    {participants ? participants.map((participant, index) => {
                        let keyValue = participant[index]
                        return (<StudyRoomCard id={index} key={keyValue} width={'90vw'}
                                               height={'40px'}
                                               content={<>{participant}
                                                   {participant !== owner ? <Button
                                                   variant="text"
                                                   sx={{borderColor: "none"}}
                                                   onClick={() => handleDelete(index)}><ClearIcon
                                                   style={{color: '#912338'}}/></Button> : <></>}
                                               </>}/>)
                    }) : <></>}
                </div>
                <div><h4>Friends:</h4></div>
                <div style={{overflow: "auto", maxHeight: "26vh"}}>
                    {availableFriends ? availableFriends.map((availableFriend, index) => {
                        let keyValue = availableFriend[index]
                        return (
                            <StudyRoomCard id={index}
                                           key={keyValue}
                                           width={'90vw'}
                                           height={'40px'}
                                           content={<>{availableFriend}<Button
                                               variant="text"
                                               sx={{borderColor: "none"}}
                                               onClick={() => handleAdd(index)}><AddIcon
                                               style={{color: '#057D78'}}/></Button></>}/>)
                    }) : <></>}
                </div>
            </div>
            <div style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                position: "fixed",
                bottom: "30px",
            }}>
                <div style={{color: 'red'}}>{errorMessage}</div>
                <PrimaryButton2 content={"Done"} colour={'#912338'} width={"90vw"} onClick={handleDone}/>
            </div>
        </>
    )

    return (
        participantsList
    );
}
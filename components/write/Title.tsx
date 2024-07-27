// app/components/write/Title.tsx
'use client'

import React, { useState, ChangeEvent, FC } from 'react';
import { Input, Textarea } from "@nextui-org/react";

interface TitleProps {
    setTitle: (title: string) => void;
    setDescription: (description: string) => void;
    setHashtag: (hashtag: string) => void;
}

const Title: FC<TitleProps> = ({ setTitle, setDescription, setHashtag }) => {
    const [localTitle, setLocalTitle] = useState('');
    const [localDescription, setLocalDescription] = useState('');
    const [localHashtag, setLocalHashtag] = useState('');

    const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setLocalTitle(e.target.value);
        setTitle(e.target.value);
    };

    const handleDescriptionChange = (e: ChangeEvent<HTMLInputElement>) => {
        setLocalDescription(e.target.value);
        setDescription(e.target.value);
    };

    const handleHashtagChange = (e: ChangeEvent<HTMLInputElement>) => {
        setLocalHashtag(e.target.value);
        setHashtag(e.target.value);
    };

    return (
        <div className="flex flex-col gap-4 m-2">
            <Input
                type="text"
                label="Title"
                placeholder="Enter the title"
                value={localTitle}
                onChange={handleTitleChange}
            />

            <Textarea
                label="Description"
                placeholder="Enter the description"
                value={localDescription}
                onChange={handleDescriptionChange}
            />

            <Input
                type="text"
                label="Hashtag"
                placeholder="Enter the hashtag"
                value={localHashtag}
                onChange={handleHashtagChange}
            />
        </div>
    );
};

export default Title;

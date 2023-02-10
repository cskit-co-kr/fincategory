import React, { useEffect, useState } from 'react'
import Select from 'react-select'
import { MultiValueOptions } from '../typings'
import { enUS } from '../lang/en-US'
import { koKR } from '../lang/ko-KR'
import { useRouter } from 'next/router'
import Box from '@mui/material/Box'
import Slider from '@mui/material/Slider'
import axios from 'axios'

type Options = {
    options: Array<MultiValueOptions>,
}

function SearchSidebar(props: any) {
    const router = useRouter()
    const { locale } = router
    const t = locale === 'ko' ? koKR : enUS

    const [options, setOptions] = useState<Options[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const [optionsCountries, setOptionsCountries] = useState<Options[]>([])
    const [isLoadingCountries, setIsLoadingCountries] = useState(true)

    const [optionsLanguages, setOptionsLanguages] = useState<Options[]>([])
    const [isLoadingLanguages, setIsLoadingLanguages] = useState(true)

    const optionsChannelTypes = [{
        value: "channel",
        label: t['channel']
    }]

    const cats = props.categories?.map((item:any) => {
        const obj = JSON.parse(item.name)
        return(
            {
            value: item.id,
            label: locale === "ko" ? obj.ko : obj.en
            }
        )
    })

    const countries = props.countries?.map((item:any) => {
        return (
            {
            value: item.id,
            label: item.nicename
            }
        )
    })

    const languages = props.languages?.map((item:any) => {
        return (
            {
            value: item.id,
            label: item.value
            }
        )
    })

    useEffect(() => {
        setOptions(cats)
        setOptionsCountries(countries)
        setOptionsLanguages(languages)

        setIsLoading(false)
        setIsLoadingCountries(false)
        setIsLoadingLanguages(false)
    }, [locale, props.categories])
    
    const colorStyles = {
        multiValue: (styles:any, { data }:any) => {
            return {
                ...styles,
                backgroundColor: '#D6e8FC',
                color: '#3886E2',
                borderRadius: 5,
                border: '1px solid #3886E2',
                
            }
        },
        multiValueLabel: (styles:any, { data }:any) => {
            return {
                ...styles,
                color: '#3886E2',
            }
        },
        multiValueRemove: (styles:any, { data }:any) => {
            return {
                ...styles,
                color: '#3886E2',
                cursor: 'pointer',
                ':hover': {
                    color: '#fff',
                    backgroundColor: '#3886E2',
                    borderRadius: 3
                },
                borderRadius: 5
            }
        },
        placeholder: (base: any) => ({
            ...base,
            fontSize: '0.75rem',
        }),
    }

    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [selectedLanguage, setSelectedLanguage] = useState(null);

    const handleSubmit = async (event: any) => {
        event.preventDefault()
        const desc = event.target.description.checked ? true : false
        const q = event.target.searchText.value === undefined ? null : event.target.searchText.value
        const ct = event.target.type.value === undefined ? null : event.target.type.value
        const data = {
            query: q,
            withDesc: desc,
            category: selectedCategory,
            country: selectedCountry,
            language: selectedLanguage,
            channel_type: ct,
            channel_age: event.target.channelsAge.value,
            erp: event.target.ERP.value,
            subscribers_from: event.target.subscribersFrom.value,
            subscribers_to: event.target.subscribersTo.value,
            average_post_reach_from: event.target.averagePostReachFrom.value,
            average_post_reach_to: event.target.averagePostReachTo.value,
            citation_index_from: event.target.citationIndexFrom.value,
            citation_index_to: event.target.citationIndexTo.value
        }

        const JSONdata = JSON.stringify(data)

        const response = await axios.post(`${process.env.API_URL}/client/telegram/getChannel`, data)
        const result = await response.data
        console.log(result)
    }

    return (
    <div className='flex flex-col w-[310px]'>
        <form onSubmit={handleSubmit}>
        <div className='flex flex-col gap-3 border border-gray-200 rounded-md pt-3 pb-5 px-4 bg-white'>
            <label className='flex flex-col gap-2'>{t['by-keyword']}
                <input 
                    name='searchText'
                    placeholder={t['type-here']}
                    type='text'
                    className='py-3 px-3 text-xs outline-none rounded-lg border border-gray-200'
                />
            </label>
            <label className='text-sm flex gap-2 cursor-pointer'>
                <input name='description' value='true' type="checkbox" />{t['search-also-in-description']}
            </label>
            <label className='flex flex-col gap-2'>{t['channel-topic']}
                <Select
                    defaultValue={selectedCategory}
                    onChange={setSelectedCategory}
                    name='category' 
                    isLoading={isLoading} 
                    styles={colorStyles} 
                    options={options} 
                    placeholder={t['select-topic']} 
                    isMulti 
                />
            </label>
            <label className='flex flex-col gap-2'>{t['channel-country']}
                <Select 
                    defaultValue={selectedCountry}
                    onChange={setSelectedCountry}
                    name='country' 
                    isLoading={isLoadingCountries} 
                    styles={colorStyles} 
                    options={optionsCountries} 
                    placeholder={t['select-country']} 
                    isMulti 
                />
            </label>
            <label className='flex flex-col gap-2'>{t['channel-language']}
                <Select 
                    defaultValue={selectedLanguage}
                    onChange={setSelectedLanguage}
                    name='language' 
                    isLoading={isLoadingLanguages} 
                    styles={colorStyles} 
                    options={optionsLanguages} 
                    placeholder={t['select-language']} 
                    isMulti 
                />
            </label>
            <label className='flex flex-col gap-2'>{t['channel-type']}
                <Select name='type' styles={colorStyles} options={optionsChannelTypes} placeholder={t['select-type']} isMulti />
            </label>
        </div>

        <div className='flex flex-col gap-3 mt-5 border border-gray-200 rounded-md pt-3 pb-5 px-3 bg-white'>
            <label className='flex flex-col gap-2'>{t['channels-age-from-months']}
                <Box className='pl-3 pr-6'>
                    <Slider
                        name='channelsAge'
                        valueLabelDisplay="auto"
                        size="small"
                        defaultValue={0}
                        min={0}
                        max={36}
                        marks={[{value:0,label:0},{value:36,label:'36+'}]}
                    />
                </Box>
            </label>
            <label className='flex flex-col gap-2'>{t['engagement-rate-erp']}
                <Box className='pl-3 pr-6'>
                    <Slider
                        name='ERP'
                        valueLabelDisplay="auto"
                        size="small"
                        defaultValue={0}
                        min={0}
                        max={100}
                        marks={[{value:1,label:'0%'},{value:100,label:'100%+'}]}
                    />
                </Box>
            </label>
        </div>
        <div className='flex flex-col gap-3 mt-5 border border-gray-200 rounded-md pt-3 pb-5 px-3 bg-white'>
            <label className='flex flex-col gap-2'>{t['subscribers']}
                <div className='flex gap-2'>
                <input 
                    name='subscribersFrom'
                    placeholder='from'
                    type='text'
                    className='py-2 px-3 text-sm outline-none rounded-lg border border-gray-200 w-1/2'
                />
                <input 
                    name='subscribersTo'
                    placeholder='to'
                    type='text'
                    className='py-2 px-3 text-sm outline-none rounded-lg border border-gray-200 w-1/2'
                />
                </div>
            </label>
            <label className='flex flex-col gap-2'>{t['average-post-reach']}
                <div className='flex gap-2'>
                <input 
                    name='averagePostReachFrom'
                    placeholder='from'
                    type='text'
                    className='py-2 px-3 text-sm outline-none rounded-lg border border-gray-200 w-1/2'
                />
                <input 
                    name='averagePostReachTo'
                    placeholder='to'
                    type='text'
                    className='py-2 px-3 text-sm outline-none rounded-lg border border-gray-200 w-1/2'
                />
                </div>
            </label>
            <label className='flex flex-col gap-2'>{t['average-post-reach-24hours']}
                <div className='flex gap-2'>
                <input 
                    name='averagePostReach24From'
                    placeholder='from'
                    type='text'
                    className='py-2 px-3 text-sm outline-none rounded-lg border border-gray-200 w-1/2'
                />
                <input 
                    name='averagePostReach24To'
                    placeholder='to'
                    type='text'
                    className='py-2 px-3 text-sm outline-none rounded-lg border border-gray-200 w-1/2'
                />
                </div>
            </label>
            <label className='flex flex-col gap-2'>{t['citation-index']}
                <div className='flex gap-2'>
                <input 
                    name='citationIndexFrom'
                    placeholder='from'
                    type='text'
                    className='py-2 px-3 text-sm outline-none rounded-lg border border-gray-200 w-1/2'
                />
                <input 
                    name='citationIndexTo'
                    placeholder='to'
                    type='text'
                    className='py-2 px-3 text-sm outline-none rounded-lg border border-gray-200 w-1/2'
                />
                </div>
            </label>
            <button
                type='submit'
                className='bg-primary px-10 rounded-lg text-sm py-2 w-fit self-center text-white'>
                    {t['search']}
            </button>
        </div>
        </form>
    </div>
  )
}

export default SearchSidebar
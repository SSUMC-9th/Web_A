interface ITextInput{
    onChange: (text: string) => void;
}

const TextInput = ({ onChange }: ITextInput) => {
    console.log('TextInput rendered');

    return (
        <input
            placeholder='Enter text'
            type='text'
            className="bg-neutral-800 text-neutral-100 p-2 rounded-md"
            onChange={(e) => onChange(e.target.value)}
        />
    );
}

export default TextInput;
import React, { useState } from 'react';

interface OTPInputProps {
  length: number;
  onChange: (otp: string) => void;
  className?: string;
}

const OTPInput: React.FC<OTPInputProps> = ({ length, onChange, className }) => {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(''));

  const handleChange = (value: string, index: number) => {
    if (/^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      onChange(newOtp.join(''));
    }
  };

  return (
    <div
      className={className}
      style={{ display: 'flex', gap: '8px', marginBlock: '20px' }}
    >
      {otp.map((digit, index) => (
        <input
          className='border rounded-md'
          key={index}
          type='text'
          value={digit}
          onChange={(e) => handleChange(e.target.value, index)}
          maxLength={1}
          style={{
            width: '40px',
            height: '40px',
            textAlign: 'center',
            fontSize: '20px',
          }}
        />
      ))}
    </div>
  );
};

export default OTPInput;

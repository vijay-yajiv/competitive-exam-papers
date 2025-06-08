import React from 'react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-center">About Competitive Exam Papers</h1>
      
      <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
        <p className="text-gray-700 mb-6">
          At Competitive Exam Papers, our mission is to provide students with easy access to comprehensive
          collections of previous years' papers for competitive exams like IIT-JEE, NEET, and GATE. We believe
          in the power of practice and preparation, and aim to make quality study materials accessible to all
          students regardless of their location or background.
        </p>
        
        <h2 className="text-2xl font-semibold mb-4">What We Offer</h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
          <li>
            <strong>Comprehensive Collection:</strong> Access to a vast library of previous years' papers sorted
            by exam type and year.
          </li>
          <li>
            <strong>Detailed Solutions:</strong> Step-by-step solutions to help you understand the correct approach
            to solving problems.
          </li>
          <li>
            <strong>Free Access:</strong> All materials are provided free of cost to support your academic journey.
          </li>
          <li>
            <strong>Regularly Updated:</strong> Our collection is regularly updated with the latest exam papers
            as they become available.
          </li>
        </ul>
        
        <h2 className="text-2xl font-semibold mb-4">Why Use Previous Year Papers?</h2>
        <p className="text-gray-700 mb-6">
          Studying previous years' papers is one of the most effective strategies for exam preparation. Here's why:
        </p>
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-medium mb-2">Understand Exam Pattern</h3>
            <p className="text-gray-600">
              Get familiar with the format, type of questions, and marking scheme of the actual exam.
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-medium mb-2">Identify Important Topics</h3>
            <p className="text-gray-600">
              Recognize frequently asked concepts and focus your preparation on high-yield topics.
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-medium mb-2">Improve Time Management</h3>
            <p className="text-gray-600">
              Practice solving papers within the allotted time to enhance your speed and accuracy.
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-medium mb-2">Build Confidence</h3>
            <p className="text-gray-600">
              Regular practice with previous papers boosts your confidence and reduces exam anxiety.
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-8">
        <h2 className="text-2xl font-semibold mb-4 text-center">Get Started Today</h2>
        <p className="text-gray-700 mb-6 text-center">
          Begin your exam preparation journey with our collection of high-quality exam papers.
        </p>
        <div className="flex justify-center">
          <Link 
            href="/exams" 
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Browse Exam Papers
          </Link>
        </div>
      </div>
    </div>
  );
}

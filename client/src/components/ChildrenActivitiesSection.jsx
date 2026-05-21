import Spline from '@splinetool/react-spline';

const ChildrenActivitiesSection = () => {
  const activities = [
    {
      title: 'Exploring Creativity',
      description: 'Children love expressing themselves through art and creative activities.',
      sceneUrl: 'https://prod.spline.design/iIFruKtC25f8cKir/scene.splinecode', // Replace with your Spline URL
    },
    {
      title: 'Playing Outdoors',
      description: 'Outdoor activities help children connect with nature and stay active.',
      sceneUrl: 'https://prod.spline.design/iIFruKtC25f8cKir/scene.splinecode', // Replace with your Spline URL
    },
    {
      title: 'Learning through Play',
      description: 'Toys and games make learning exciting and engaging for kids.',
      sceneUrl: 'https://prod.spline.design/iIFruKtC25f8cKir/scene.splinecode', // Replace with your Spline URL
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-12">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">
          What Children Love to Do
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {activities.map((activity) => (
            <div key={activity.title} className="bg-white shadow-lg rounded-lg overflow-hidden">
              <div className="h-64">
                <Spline scene={activity.sceneUrl} className='w-full h-full' />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                  {activity.title}
                </h3>
                <p className="text-gray-600">{activity.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ChildrenActivitiesSection;

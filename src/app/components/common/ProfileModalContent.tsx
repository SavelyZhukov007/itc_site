import type { PersonProfile } from '../../types';

type ProfileModalContentProps = {
  profile: PersonProfile;
  description: string;
  listTitle?: string;
  list: string[];
};

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

export function ProfileModalContent({ profile, description, listTitle = 'Основные направления', list }: ProfileModalContentProps) {
  return (
    <div className="profile-modal-content">
      <div className="profile-hero">
        {profile.image ? (
          <div className="profile-photo-frame">
            <img className="profile-photo" src={profile.image} alt={profile.name} />
          </div>
        ) : (
          <div className="profile-photo-frame profile-photo-frame--placeholder" aria-hidden="true">
            <span>{getInitials(profile.name)}</span>
          </div>
        )}

        <div className="profile-main-copy">
          <span className="profile-badge">Команда ИТС</span>
          <h4>{profile.name}</h4>
          <p className="profile-role">{profile.role}</p>
          <p className="profile-meta">{profile.meta}</p>
          {profile.quote ? <blockquote className="profile-quote">{profile.quote}</blockquote> : null}
        </div>
      </div>

      <div className="modal-detail-copy">
        <p>{description}</p>
        <p>{profile.bio}</p>

        <p className="modal-list-label">{listTitle}</p>
        <ul className="modal-list">
          {list.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
